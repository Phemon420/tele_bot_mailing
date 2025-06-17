from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegisterSerializer,LoginSerializer,TelegramUserNameSerializer,ProfileSerializer,TelegramUserListSerializer
from .tokenauthentication import JwtAuthentication
from rest_framework import status
from .models import TelegramUserName,User
from .tasks import send_welcome_email

@api_view(['POST','GET'])
def register_user(request):
    serializer=RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        send_welcome_email.delay(serializer.data['email'])
        return Response(serializer.data,status=201)
    return Response(serializer.errors,status=400)

@api_view(['POST','GET'])
def login_user(request):
    # print(f"Login attempt with data: {request.data}")
    serializer=LoginSerializer(data=request.data)
    # print(f"Serializer data: {serializer.data['email'] if serializer.is_valid() else 'Invalid data'}")
    if serializer.is_valid():
        token=JwtAuthentication.generate_token(payload=serializer.data)
        return Response({
            "message":"Login Successful",
            "token":token,
            "user":serializer.data['email']
            },status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET'])
def telegram_webhook(request):
    try:
        message = request.data.get("message")
        if not message:
            return Response({"error": "No message in payload"}, status=400)

        message_id = message.get("message_id")
        sender = message.get("from", {})
        username = sender.get("username") or sender.get("first_name")

        if not (message_id and username):
            return Response({"error": "Missing message_id or fallback username"}, status=400)

        serializer = TelegramUserNameSerializer(data={
            "message_id": message_id,
            "username": username
        })

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=201)
        else:
            return Response(serializer.errors, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def fetch_all_telegram_users(request):
    try:
        telegram_users = TelegramUserName.objects.all().order_by('-id')  # Latest first
        serializer = TelegramUserListSerializer(telegram_users, many=True)
        
        return Response({
            "success": True,
            "count": telegram_users.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
def fetch_profile_by_email(request):
    print(f"Request data: {request.data}")
    print(f"Query params: {request.query_params}")
    try:
        email = request.data.get('email')
        email = email.strip('"')
        print(f"Email parameter: {email}")
        if not email:
            return Response({
                "success": False,
                "error": "Email parameter is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch user profile data
        try:
            user = User.objects.get(email=email)
            # telegram_users = TelegramUserName.objects.all()
            
            profile_serializer = ProfileSerializer(user)
            profile_data = profile_serializer.data
                        
            return Response({
                "success": True,
                "profile": profile_data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                "success": False,
                "error": "User with this email does not exist"
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)