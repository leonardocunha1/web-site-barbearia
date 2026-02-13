export type GetProfessionalScheduleParams = {
  professionalId: string;
  /**
   * @pattern ^\d{4}-\d{2}-\d{2}$
   */
  date: string;
  serviceIds?: string;
};
