import { Server, Shield, Zap, MessageCircle, CheckCircle } from "lucide-react";

const FeatureCard = ({ Icon, title, description }) => (
  <div className="card text-center p-4 border rounded-2xl shadow-sm">
    <Icon className="mx-auto mb-4 text-primary-600" size={48} />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-2">{description}</p>
    <div className="flex justify-center items-center text-green-600 font-medium">
      <CheckCircle className="mr-1" size={18} />
      Development Completed
    </div>
  </div>
);

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      <FeatureCard
        Icon={Server}
        title="Django REST API"
        description="Robust backend with public and protected endpoints"
      />
      <FeatureCard
        Icon={Shield}
        title="Authentication"
        description="Token-based authentication with user management"
      />
      <FeatureCard
        Icon={Zap}
        title="Celery Tasks"
        description="Background task processing with Redis"
      />
      <FeatureCard
        Icon={MessageCircle}
        title="Telegram Bot"
        description="Integrated bot for user interaction"
      />
    </div>
  );
}
