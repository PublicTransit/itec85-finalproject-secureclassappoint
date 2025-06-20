
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, User, BookOpen } from 'lucide-react';
import { Appointment } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

const ProfessorDashboard: React.FC = () => {
  const { user } = useAuth();
  const professorSubject = user?.subject || '';

  // Mock appointments - dynamically filter by professor's actual subject
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Initialize appointments with correct subject mapping
    const initialAppointments: Appointment[] = [
      {
        id: '1',
        studentId: '1',
        professorId: user?.id || '2',
        studentName: 'John Student',
        professorName: user?.name || 'Prof. Santos',
        subject: professorSubject, // Use actual professor's subject
        date: '2024-12-20',
        time: '10:00',
        status: 'pending'
      },
      {
        id: '2',
        studentId: '4',
        professorId: user?.id || '2',
        studentName: 'Jane Student',
        professorName: user?.name || 'Prof. Santos',
        subject: professorSubject, // Use actual professor's subject
        date: '2024-12-21',
        time: '14:00',
        status: 'pending'
      }
    ];

    // Only show appointments if professor has a subject assigned
    if (professorSubject) {
      setAppointments(initialAppointments);
    }
  }, [user, professorSubject]);

  const handleAppointmentAction = (appointmentId: string, action: 'approved' | 'rejected') => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: action }
          : appointment
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 hover:bg-green-700';
      case 'rejected': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  // Filter appointments for this professor's subject and professor ID
  const professorAppointments = appointments.filter(
    appointment => 
      appointment.subject === professorSubject && 
      appointment.professorId === user?.id
  );

  const pendingAppointments = professorAppointments.filter(a => a.status === 'pending');
  const approvedAppointments = professorAppointments.filter(a => a.status === 'approved');
  const rejectedAppointments = professorAppointments.filter(a => a.status === 'rejected');

  if (!professorSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <Card className="cvsu-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">No Subject Assigned</h2>
            <p className="text-muted-foreground">Please contact the administrator to assign a subject to your account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="cvsu-gradient p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Professor Dashboard</h2>
          </div>
          <p className="text-muted-foreground">
            Subject: <span className="font-semibold text-primary">{professorSubject}</span> | 
            Manage your appointment requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-primary">{professorAppointments.length}</p>
                </div>
                <User className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingAppointments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedAppointments.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedAppointments.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments */}
        {pendingAppointments.length > 0 && (
          <Card className="cvsu-card mb-6 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span>Pending Requests for {professorSubject}</span>
              </CardTitle>
              <CardDescription>Review and respond to student appointment requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Student: {appointment.studentName}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleAppointmentAction(appointment.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Appointments */}
        <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">All {professorSubject} Appointments</CardTitle>
            <CardDescription>Complete history of appointment requests for your subject</CardDescription>
          </CardHeader>
          <CardContent>
            {professorAppointments.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No appointment requests for {professorSubject} yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {professorAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-primary/20 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Student: {appointment.studentName}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
