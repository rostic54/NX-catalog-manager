import { Model, Types } from 'mongoose';
import { User } from './schemas/User.schema';

export async function addAppointmentIdToUser(
  userModel: Model<User>,
  appointmentId: string,
  userIds: string[],
): Promise<boolean> {
  const objectIds = userIds.map((id) => new Types.ObjectId(id));

  const result = await userModel
    .updateMany(
      { _id: { $in: objectIds } },
      { $addToSet: { appointments: appointmentId } },
    )
    .exec();
  return result.acknowledged && result.modifiedCount > 0;
}

export async function deleteAppointmentIdFromUser(
  userModel: Model<User>,
  appointmentId: string,
  userIds: string[],
): Promise<boolean> {
  const objectIds = userIds.map((id) => new Types.ObjectId(id));

  const result = await userModel
    .updateMany(
      { _id: { $in: objectIds } },
      { $pull: { appointments: appointmentId } },
    )
    .exec();
  return result.acknowledged && result.modifiedCount > 0;
}
