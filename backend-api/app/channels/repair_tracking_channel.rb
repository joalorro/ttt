class RepairTrackingChannel < ApplicationCable::Channel
  def subscribed
    stream_for repair
  end

  def repair
    Repair.find(params[:id])
  end
end
