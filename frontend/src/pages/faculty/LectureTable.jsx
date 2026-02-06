import React from 'react';

const LectureTable = ({ lectures, loading, onStartClass }) => {
    
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // New Robust Status Logic
    const getStatus = (lec) => {
        if (lec.activeOtp) return 'LIVE'; // Has code = Running
        if (lec.otpExpiryTime) return 'COMPLETED'; // Has expiry history = Done
        return 'SCHEDULED'; // Neither = New
    };

    return (
        <div className="col-12">
            <div className="card shadow-sm border-0 rounded-0">
                <div className="card-header bg-dark text-white p-3">
                    <h5 className="mb-0">My Scheduled Lectures</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover mb-0 align-middle">
                            <thead className="table-secondary">
                                <tr>
                                    <th className="px-4">Date & Time</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th className="text-end px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lectures.length > 0 ? (
                                    lectures.map(lec => {
                                        const status = getStatus(lec);
                                        return (
                                            <tr key={lec.id}>
                                                <td className="px-4 fw-bold">{formatDate(lec.startTime)}</td>
                                                <td>
                                                    <span className="badge bg-info text-dark">{lec.subjectName}</span>
                                                </td>
                                                <td>
                                                    {status === 'LIVE' && <span className="badge bg-success">Live</span>}
                                                    {status === 'COMPLETED' && <span className="badge bg-secondary">Completed</span>}
                                                    {status === 'SCHEDULED' && <span className="badge bg-warning text-dark">Scheduled</span>}
                                                </td>
                                                <td className="text-end px-4">
                                                    {status === 'LIVE' ? (
                                                        <button className="btn btn-success btn-sm" disabled>In Progress...</button>
                                                    ) : status === 'COMPLETED' ? (
                                                        <button className="btn btn-secondary btn-sm" disabled>Class Ended</button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn-dark btn-sm px-4"
                                                            onClick={() => onStartClass(lec.id)}
                                                            disabled={loading}
                                                        >
                                                            {loading ? 'Starting...' : 'Start Class'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            No lectures scheduled.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureTable;