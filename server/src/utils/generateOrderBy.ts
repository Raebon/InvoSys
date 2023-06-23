import db from '../../models';
export const generateOrderBy = (
  column: string,
  field: string,
  direction: 'ASC' | 'DESC',
): [string, 'ASC' | 'DESC'] => {
  const literal = db.sequelize.literal(`"${column}.${field}"`);
  return [literal, direction];
};
