import { Movement } from '@/types/movement';
import { PaginatedResponse } from '@/types/employee';

export const MOCK_MOVEMENTS: Movement[] = [
  {
    id: 1,
    employee: 1,
    employee_code: 'EMP-001',
    employee_first_name: 'Sarah',
    employee_last_name: 'Ahmed',
    movement_type: 'promotion',
    status: 'pending',
    remarks:
      'Sarah has consistently exceeded performance targets for the past 3 quarters. She led the migration of our core platform to microservices, mentored 2 junior engineers, and delivered the API gateway project ahead of schedule. This promotion recognizes her technical leadership and contributions to the team.',
    requested_by: 2,
    requested_by_first_name: 'Admin',
    requested_by_last_name: 'User',
    effective_date: '2026-04-15T00:00:00Z',
    current_department: 'Engineering',
    target_department: 'Engineering',
    current_position: 'Software Engineer',
    new_position: 'Senior Software Engineer',
    created_at: '2026-03-28T10:30:00Z',
    updated_at: '2026-03-28T10:30:00Z',
  },
  {
    id: 2,
    employee: 2,
    employee_code: 'EMP-015',
    employee_first_name: 'Mohammed',
    employee_last_name: 'Khan',
    movement_type: 'transfer',
    status: 'approved',
    remarks:
      'Mohammed has expressed interest in transitioning to the Sales team. His strong understanding of product marketing and customer engagement makes him an excellent fit for the Sales Manager role. This transfer aligns with his career development goals and the Sales team\'s need for leadership.',
    requested_by: 2,
    requested_by_first_name: 'Admin',
    requested_by_last_name: 'User',
    approved_by: 3,
    approved_by_first_name: 'HR',
    approved_by_last_name: 'Director',
    effective_date: '2026-04-01T00:00:00Z',
    current_department: 'Marketing',
    target_department: 'Sales',
    current_position: 'Marketing Specialist',
    new_position: 'Sales Manager',
    created_at: '2026-03-25T09:00:00Z',
    updated_at: '2026-03-26T11:45:00Z',
  },
  {
    id: 3,
    employee: 3,
    employee_code: 'EMP-023',
    employee_first_name: 'Fatima',
    employee_last_name: 'Noor',
    movement_type: 'resignation',
    status: 'rejected',
    remarks:
      'Fatima submitted her resignation citing personal reasons. After discussion with management, the request was rejected and a retention plan was offered.',
    requested_by: 3,
    requested_by_first_name: 'Fatima',
    requested_by_last_name: 'Noor',
    approved_by: 3,
    approved_by_first_name: 'HR',
    approved_by_last_name: 'Director',
    effective_date: '2026-04-30T00:00:00Z',
    current_department: 'Finance',
    current_position: 'Financial Analyst',
    created_at: '2026-03-22T14:15:00Z',
    updated_at: '2026-03-23T09:00:00Z',
  },
  {
    id: 4,
    employee: 4,
    employee_code: 'EMP-042',
    employee_first_name: 'John',
    employee_last_name: 'Davis',
    movement_type: 'transfer',
    status: 'pending',
    remarks:
      'Requesting transfer to Engineering department to work on the new platform initiative. John has been self-studying software development and has completed several certifications.',
    requested_by: 2,
    requested_by_first_name: 'Admin',
    requested_by_last_name: 'User',
    effective_date: '2026-05-01T00:00:00Z',
    current_department: 'Operations',
    target_department: 'Engineering',
    current_position: 'Operations Coordinator',
    new_position: 'Junior Developer',
    created_at: '2026-03-20T11:00:00Z',
    updated_at: '2026-03-20T11:00:00Z',
  },
  {
    id: 5,
    employee: 5,
    employee_code: 'EMP-008',
    employee_first_name: 'Lisa',
    employee_last_name: 'Wong',
    movement_type: 'promotion',
    status: 'approved',
    remarks:
      'Promoted to Team Lead after successful delivery of the Q1 product launch. Lisa demonstrated exceptional leadership and cross-functional coordination.',
    requested_by: 2,
    requested_by_first_name: 'Admin',
    requested_by_last_name: 'User',
    approved_by: 3,
    approved_by_first_name: 'HR',
    approved_by_last_name: 'Director',
    effective_date: '2026-04-01T00:00:00Z',
    current_department: 'Product',
    target_department: 'Product',
    current_position: 'Product Manager',
    new_position: 'Team Lead',
    created_at: '2026-03-18T08:45:00Z',
    updated_at: '2026-03-19T14:00:00Z',
  },
  {
    id: 6,
    employee: 6,
    employee_code: 'EMP-031',
    employee_first_name: 'Carlos',
    employee_last_name: 'Rivera',
    movement_type: 'resignation',
    status: 'pending',
    remarks:
      'Voluntary resignation — relocating abroad for personal reasons. Last working day requested as end of May.',
    requested_by: 6,
    requested_by_first_name: 'Carlos',
    requested_by_last_name: 'Rivera',
    effective_date: '2026-05-31T00:00:00Z',
    current_department: 'Human Resources',
    current_position: 'HR Specialist',
    created_at: '2026-03-15T16:20:00Z',
    updated_at: '2026-03-15T16:20:00Z',
  },
];

export function getMockMovements(params: {
  page?: number;
  page_size?: number;
  status?: string;
  movement_type?: string;
  search?: string;
}): PaginatedResponse<Movement> {
  const { page = 1, page_size = 10, status, movement_type, search } = params;

  let filtered = [...MOCK_MOVEMENTS];

  if (status) {
    filtered = filtered.filter((m) => m.status === status);
  }

  if (movement_type) {
    filtered = filtered.filter((m) => m.movement_type === movement_type);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.employee_first_name.toLowerCase().includes(q) ||
        m.employee_last_name.toLowerCase().includes(q)
    );
  }

  const start = (page - 1) * page_size;
  const records = filtered.slice(start, start + page_size);

  return {
    total_records: filtered.length,
    total_pages: Math.max(1, Math.ceil(filtered.length / page_size)),
    current_page: page,
    records,
  };
}

export function getMockMovementById(id: number): Movement | null {
  return MOCK_MOVEMENTS.find((m) => m.id === id) || null;
}
