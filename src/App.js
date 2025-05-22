import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import './App.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const initialFormData = {
    hoTen: '', ngaySinh: '', gioiTinh: 'Nam', diaChi: '',
    soDienThoai: '', ngheNghiep: '', benhNen: '', lyDoKham: '',
    tienSuNhaKhoa: '', chiTiet: ''
};

function App() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPatient, setEditingPatient] = useState(null); // Bệnh nhân đang được sửa
    const [formMode, setFormMode] = useState('create'); // 'create' hoặc 'edit'
    const [showForm, setShowForm] = useState(false); // Để ẩn/hiện form

    const fetchPatients = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/patients`);
            setPatients(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error("Lỗi khi tải danh sách bệnh nhân:", error);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleFormSubmit = async (formData) => {
        try {
            if (formMode === 'edit' && editingPatient) {
                // Chế độ chỉnh sửa
                const response = await axios.put(`${API_URL}/patients/${editingPatient.id}`, formData);
                setPatients(prevPatients =>
                    prevPatients.map(p => (p.id === editingPatient.id ? response.data : p))
                );
                alert('Cập nhật hồ sơ thành công!');
            } else {
                // Chế độ tạo mới
                const response = await axios.post(`${API_URL}/patients`, formData);
                setPatients(prevPatients => [response.data, ...prevPatients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                alert('Thêm hồ sơ thành công!');
            }
            setEditingPatient(null);
            setFormMode('create');
            setShowForm(false); // Ẩn form sau khi submit
        } catch (error) {
            console.error("Lỗi khi lưu hồ sơ:", error.response ? error.response.data : error.message);
            alert(`Có lỗi xảy ra: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setFormMode('edit');
        setShowForm(true); // Hiện form để sửa
        window.scrollTo(0, 0); // Cuộn lên đầu trang để thấy form
    };

    const handleDelete = async (patientId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
            try {
                await axios.delete(`${API_URL}/patients/${patientId}`);
                setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
                alert('Xóa hồ sơ thành công!');
                if (editingPatient && editingPatient.id === patientId) { // Nếu đang sửa hồ sơ vừa xóa
                    setEditingPatient(null);
                    setFormMode('create');
                    setShowForm(false);
                }
            } catch (error) {
                console.error("Lỗi khi xóa hồ sơ:", error);
                alert('Có lỗi xảy ra khi xóa hồ sơ.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingPatient(null);
        setFormMode('create');
        setShowForm(false);
    };

    const toggleShowForm = () => {
        if (showForm && formMode === 'edit') { // Nếu đang sửa mà ấn nút "Thêm mới/Đóng form"
             if (window.confirm("Bạn có thay đổi chưa lưu. Bạn muốn đóng form không?")) {
                handleCancelEdit();
             }
        } else {
            setShowForm(!showForm);
            if (!showForm) { // Nếu đang mở form tạo mới
                setEditingPatient(null);
                setFormMode('create');
            }
        }
    };


    return (
        <div className="App">
            <header className="App-header">
                <div className="container header-content">
                    <h1>Hệ Thống Quản Lý Hồ Sơ Nha Khoa</h1>
                    <button onClick={toggleShowForm} className="btn btn-header-toggle">
                        {showForm ? (formMode === 'edit' ? 'Đang Sửa (Đóng Form)' : 'Đóng Form Thêm Mới') : 'Thêm Hồ Sơ Mới'}
                    </button>
                </div>
            </header>
            <main>
                {showForm && (
                    <div className="container">
                        <PatientForm
                            key={editingPatient ? editingPatient.id : 'create'} // Key để reset form khi chuyển chế độ
                            initialData={editingPatient || initialFormData}
                            mode={formMode}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCancelEdit}
                        />
                    </div>
                )}

                {loading ?
                    <p className="loading-text">Đang tải danh sách...</p>
                    : <PatientList
                        patients={patients}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                }
            </main>
        </div>
    );
}
export default App;