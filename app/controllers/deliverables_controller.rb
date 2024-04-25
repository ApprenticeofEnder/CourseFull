class DeliverablesController < ApplicationController
  before_action :set_deliverable, only: %i[ show update destroy ]

  # GET /deliverables
  def index
    @deliverables = Deliverable.all

    render json: @deliverables
  end

  # GET /deliverables/1
  def show
    render json: @deliverable
  end

  # POST /deliverables
  def create
    @deliverable = Deliverable.new(deliverable_params)

    if @deliverable.save
      render json: @deliverable, status: :created, location: @deliverable
    else
      render json: @deliverable.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /deliverables/1
  def update
    if @deliverable.update(deliverable_params)
      render json: @deliverable
    else
      render json: @deliverable.errors, status: :unprocessable_entity
    end
  end

  # DELETE /deliverables/1
  def destroy
    @deliverable.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_deliverable
      @deliverable = Deliverable.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def deliverable_params
      params.require(:deliverable).permit(:name, :weight, :mark, :notes)
    end
end
