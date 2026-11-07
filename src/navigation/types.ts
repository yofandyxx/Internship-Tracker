// ============================================================
// Tipe param list untuk seluruh navigator
// ============================================================

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  CompanyForm: { companyId?: string } | undefined;
  ApplicationReview: { applicationId: string };
  AdminReport: undefined;
  InternshipDetail: { internshipId: string };
  DailyLogDetail: { logId: string };
  Profile: undefined;
};

export type StudentStackParamList = {
  StudentTabs: undefined;
  InternshipApplication: undefined;
  DailyLogForm: { logId?: string } | undefined;
  InternshipDetail: { internshipId: string };
  DailyLogDetail: { logId: string };
};

export type SupervisorStackParamList = {
  SupervisorTabs: undefined;
  LogReview: { logId: string };
  EvaluationForm: { internshipId: string; studentId: string };
  SupervisorReport: undefined;
  InternshipDetail: { internshipId: string };
  DailyLogDetail: { logId: string };
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  CompanyManagement: undefined;
  ApplicationManagement: undefined;
  Profile: undefined;
};

export type StudentTabParamList = {
  StudentDashboard: undefined;
  CompanyList: undefined;
  MyInternship: undefined;
  DailyLog: undefined;
  MyEvaluation: undefined;
};

export type SupervisorTabParamList = {
  SupervisorDashboard: undefined;
  SupervisedStudents: undefined;
  Profile: undefined;
};