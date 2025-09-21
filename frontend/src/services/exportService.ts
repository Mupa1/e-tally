// Remove this import as we'll define getAuthHeaders locally

export interface County {
  id: string;
  name: string;
  code: string;
}

export interface Constituency {
  id: string;
  name: string;
  code: string;
  countyId: string;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  constituencyId: string;
}

export interface PollingStation {
  id: string;
  name: string;
  code: string;
  wardId: string;
}

export interface ExportRequest {
  format: 'excel' | 'csv';
  dataType: 'counties' | 'constituencies' | 'wards' | 'polling-stations';
  filters: {
    countyId?: string | null;
    constituencyId?: string | null;
    wardId?: string | null;
    pollingStationId?: string | null;
  };
  options: {
    includeHeaders: boolean;
    includeMetadata: boolean;
  };
}

export interface ExportResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class ExportService {
  private baseUrl = '/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Fetch all counties for dropdown
   */
  async getCounties(): Promise<County[]> {
    try {
      const response = await fetch(`${this.baseUrl}/counties`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch counties');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching counties:', error);
      return [];
    }
  }

  /**
   * Fetch constituencies for a specific county
   */
  async getConstituencies(countyId?: string): Promise<Constituency[]> {
    try {
      const url = countyId
        ? `${this.baseUrl}/constituencies?countyId=${countyId}`
        : `${this.baseUrl}/constituencies`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch constituencies');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching constituencies:', error);
      return [];
    }
  }

  /**
   * Fetch wards for a specific constituency
   */
  async getWards(constituencyId?: string): Promise<Ward[]> {
    try {
      const url = constituencyId
        ? `${this.baseUrl}/caws?constituencyId=${constituencyId}`
        : `${this.baseUrl}/caws`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wards');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
    }
  }

  /**
   * Fetch polling stations for a specific ward
   */
  async getPollingStations(wardId?: string): Promise<PollingStation[]> {
    try {
      const url = wardId
        ? `${this.baseUrl}/polling-stations?wardId=${wardId}`
        : `${this.baseUrl}/polling-stations`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch polling stations');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching polling stations:', error);
      return [];
    }
  }

  /**
   * Export data using the export endpoint
   */
  async exportData(request: ExportRequest): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/export/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Export failed' }));
      throw new Error(error.message || 'Export failed');
    }

    return response.blob();
  }
}

export const exportService = new ExportService();
