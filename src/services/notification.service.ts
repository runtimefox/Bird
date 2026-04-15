import { axiosAuth } from '@/api/interceptors';
import type { INotification } from '@/types/notification.type';

class NotificationService {
  private URL = '/notifications';

  async getNotifications() {
    const response = await axiosAuth.get<INotification[]>(this.URL);
    return response;
  }

  async markAsRead() {
    const response = await axiosAuth.patch(`${this.URL}/read`);
    return response;
  }
  async deleteNotification() {
    const response = await axiosAuth.delete(`${this.URL}`);
    return response;
  }
}

export const notificationService = new NotificationService();
