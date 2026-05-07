import { ConflictError } from "../errors/app-error";

export const checkContractOverlap = (
  existingContracts: { id: string; start_date: Date; end_date: Date }[],
  newContract: { start_date: Date; end_date: Date },
) => {
  const newStart = new Date(newContract.start_date);
  const newEnd = new Date(newContract.end_date);

  const overlapping = existingContracts.find((contract) => {
    const existingStart = new Date(contract.start_date);
    const existingEnd = new Date(contract.end_date);

    return newStart < existingEnd && newEnd > existingStart;
  });

  if (overlapping)
    throw new ConflictError(
      `Contract overlaps with existing contract: ${overlapping.id}`,
    );
};
