import React, { useState, useMemo } from 'react';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const parts = dateString.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
        return dateString;
    }
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
        return new Date(dateTimeString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return dateTimeString;
    }
};

const PatientCard = ({ patient, isExpanded, onToggleExpand, onEdit, onDelete }) => {
    return (
        <div
            className={`patient-card ${isExpanded ? 'expanded' : ''}`}
        >
            <div className="patient-card-summary" onClick={onToggleExpand} style={{ cursor: 'pointer' }}>
                <h4>{patient.hoTen || 'N/A'}</h4>
                <p>Ngày sinh: {formatDate(patient.ngaySinh)}</p>
                <p>Điện thoại: {patient.soDienThoai || 'N/A'}</p>
            </div>

            {isExpanded && (
                <div className="patient-card-details">
                    <p><strong>Giới tính:</strong> {patient.gioiTinh || 'N/A'}</p>
                    <p><strong>Địa chỉ:</strong> {patient.diaChi || 'N/A'}</p>
                    <p><strong>Nghề nghiệp:</strong> {patient.ngheNghiep || 'N/A'}</p>
                    <p><strong>Bệnh nền:</strong> {patient.benhNen || 'Không có'}</p>
                    <p><strong>Lý do khám:</strong> {patient.lyDoKham || 'N/A'}</p>
                    <p><strong>Tiền sử NK:</strong> {patient.tienSuNhaKhoa || 'N/A'}</p>
                    <p><strong>Chi tiết:</strong> {patient.chiTiet || 'N/A'}</p>
                </div>
            )}
            <div className="patient-card-actions">
                 <button onClick={() => onEdit(patient)} className="btn btn-edit">Sửa</button>
                 <button onClick={() => onDelete(patient.id)} className="btn btn-delete">Xóa</button>
            </div>
            <div className="patient-card-footer">
                <small>Tạo: {formatDateTime(patient.createdAt)}</small>
                {patient.updatedAt && <small style={{ marginLeft: '10px' }}>Sửa: {formatDateTime(patient.updatedAt)}</small>}
            </div>
        </div>
    );
};

const PatientList = ({ patients, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCardId, setExpandedCardId] = useState(null);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        setExpandedCardId(null);
    };

    const toggleExpand = (patientId) => {
        setExpandedCardId(prevId => (prevId === patientId ? null : patientId));
    };

    const filteredPatients = useMemo(() => {
        if (!Array.isArray(patients)) {
            return [];
        }
        if (!searchTerm) {
            return patients;
        }
        return patients.filter(patient =>
            (patient.hoTen && patient.hoTen.toLowerCase().includes(searchTerm)) ||
            (patient.soDienThoai && patient.soDienThoai.includes(searchTerm))
        );
    }, [patients, searchTerm]);

    if (patients === undefined || patients === null) {
        return <p className="loading-text">Đang tải dữ liệu bệnh nhân...</p>;
    }

    if (patients.length === 0 && !searchTerm) {
        return <p className="no-data-text">Chưa có hồ sơ bệnh nhân nào.</p>;
    }

    return (
        <div className="patient-list-section">
            {(patients.length > 0 || searchTerm) && (
                <>
                    <h2>Danh Sách Hồ Sơ Bệnh Nhân</h2>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Tìm theo tên, SĐT..."
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </>
            )}

            {filteredPatients.length > 0 ? (
                <div className="patient-grid">
                    {filteredPatients.map(patient => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            isExpanded={expandedCardId === patient.id}
                            onToggleExpand={() => toggleExpand(patient.id)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                searchTerm && <p className="no-results-text">Không tìm thấy hồ sơ nào phù hợp.</p>
            )}
        </div>
    );
};

export default PatientList;