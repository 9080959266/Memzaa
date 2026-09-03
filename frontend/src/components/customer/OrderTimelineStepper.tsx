import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  Camera, 
  Palette, 
  Eye, 
  ThumbsUp, 
  Printer, 
  ShieldCheck, 
  Package, 
  Truck, 
  Home 
} from 'lucide-react';
import { ITimelineStep, OrderWorkflowStatus } from '../../types';

interface OrderTimelineStepperProps {
  timeline: ITimelineStep[];
  currentStatus: OrderWorkflowStatus;
}

export const OrderTimelineStepper: React.FC<OrderTimelineStepperProps> = ({
  timeline,
  currentStatus,
}) => {
  const getStageIcon = (status: OrderWorkflowStatus) => {
    switch (status) {
      case 'ORDER_PLACED': return Package;
      case 'PAYMENT_CONFIRMED': return ThumbsUp;
      case 'PHOTOS_UPLOADED': return Camera;
      case 'EDITING': return Palette;
      case 'PROOF_READY': return Eye;
      case 'CUSTOMER_APPROVED': return CheckCircle2;
      case 'PRINTING': return Printer;
      case 'QUALITY_CHECK': return ShieldCheck;
      case 'READY': return Package;
      case 'OUT_FOR_DELIVERY': return Truck;
      case 'DELIVERED': return Home;
      default: return CircleDot;
    }
  };

  const currentIndex = timeline.findIndex(t => t.status === currentStatus);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Visual Order & Production Stepper
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stage tracking from initial raw photo uploads to doorstep delivery
          </p>
        </div>

        <span className="bg-amber-500/10 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
          Stage {currentIndex >= 0 ? currentIndex + 1 : 1} of {timeline.length}
        </span>
      </div>

      {/* Stepper Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timeline.map((step, idx) => {
          const Icon = getStageIcon(step.status);
          const isCompleted = step.completed;
          const isCurrent = step.status === currentStatus;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <div key={step.status} className="relative flex items-start gap-4 group">
              {/* Step Node Bubble */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-4 ring-white'
                    : isCurrent
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-4 ring-amber-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 ring-4 ring-white border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step Text Info */}
              <div
                className={`flex-1 p-4 rounded-2xl border transition ${
                  isCurrent
                    ? 'bg-amber-50/60 border-amber-300 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50/50 border-slate-100'
                    : 'bg-white border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>

                  {step.timestamp && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(step.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {step.description}
                </p>

                {step.updatedBy && (
                  <span className="text-[10px] text-slate-400 mt-2 block italic">
                    Updated by {step.updatedBy}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
