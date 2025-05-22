import React, { useState, useMemo } from 'react';

// Helper functions (giữ nguyên hoặc cải tiến nếu cần)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Giả sử dateString từ DB là 'YYYY-MM-DD'
        const parts = dateString.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        // Nếu là đối tượng Date đầy đủ (ví dụ từ createdAt)
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
        return dateString; // Trả về chuỗi gốc nếu không parse được
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

// --- PatientCard Component ---
const PatientCard = ({ patient, isExpanded, onToggleExpand, onEdit, onDelete }) => {
    return (
        <div
            className={`patient-card ${isExpanded ? 'expanded' : ''}`}
        >
            {/* Phần summary có thể click để mở rộng */}
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


// --- PatientList Component ---
const PatientList = ({ patients, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCardId, setExpandedCardId] = useState(null);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        setExpandedCardId(null); // Đóng card đang mở khi tìm kiếm
    };

    const toggleExpand = (patientId) => {
        setExpandedCardId(prevId => (prevId === patientId ? null : patientId));
    };

    // Sử dụng useMemo để tối ưu hóa việc lọc, chỉ tính toán lại khi patients hoặc searchTerm thay đổi
    const filteredPatients = useMemo(() => {
        // Đảm bảo patients là một mảng trước khi lọc
        if (!Array.isArray(patients)) {
            return []; // Trả về mảng rỗng nếu patients không phải là mảng
        }
        if (!searchTerm) {
            return patients;
        }
        return patients.filter(patient =>
            (patient.hoTen && patient.hoTen.toLowerCase().includes(searchTerm)) ||
            (patient.soDienThoai && patient.soDienThoai.includes(searchTerm))
            // (patient.id && patient.id.toLowerCase().includes(searchTerm)) // Tùy chọn: Tìm theo ID
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patients, searchTerm]); // Dependencies là chính xác cho logic này

    // Xử lý trường hợp `patients` prop chưa được truyền hoặc là null/undefined
    if (patients === undefined || patients === null) {
        // Bạn có thể hiển thị một spinner hoặc thông báo tải khác ở đây nếu muốn
        // Hoặc, nếu `loading` state được quản lý ở App.js và đã có thông báo loading,
        // thì có thể return null ở đây để không hiển thị gì thêm cho đến khi có dữ liệu.
        return <p className="loading-text">Đang tải dữ liệu bệnh nhân...</p>;
    }

    // Sau khi kiểm tra patients, ta có thể an tâm sử dụng nó
    if (patients.length === 0 && !searchTerm) {
        return <p className="no-data-text">Chưa có hồ sơ bệnh nhân nào.</p>;
    }

    return (
        <div className="patient-list-section">
            {/* Chỉ hiển thị tiêu đề và search bar nếu có bệnh nhân (sau khi lọc) hoặc đang tìm kiếm */}
            {/* Hoặc có thể luôn hiển thị search bar */}
            {(patients.length > 0 || searchTerm) && ( // Điều kiện này có thể cần điều chỉnh tùy theo UX mong muốn
                <>
                    <h2>Danh Sách Hồ Sơ Bệnh Nhân</h2>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Tìm theo tên, SĐT..."
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange} // Đảm bảo hàm này được gọi
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
                            onToggleExpand={() => toggleExpand(patient.id)} // Đảm bảo hàm này được gọi
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                // Chỉ hiển thị "Không tìm thấy" nếu có searchTerm và không có kết quả
                searchTerm && <p className="no-results-text">Không tìm thấy hồ sơ nào phù hợp.</p>
            )}
        </div>
    );
};

export default PatientList;