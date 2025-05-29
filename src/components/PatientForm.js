import React, { useState, useEffect } from 'react';

const PatientForm = ({ initialData, mode, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.hoTen || !formData.ngaySinh) {
            alert("Vui lòng nhập Họ tên và Ngày sinh!");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="patient-form-container">
            <h2>{mode === 'edit' ? 'Chỉnh Sửa Hồ Sơ Bệnh Nhân' : 'Tạo Hồ Sơ Bệnh Nhân Mới'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="hoTen">Họ tên bệnh nhân:</label>
                    <input type="text" id="hoTen" name="hoTen" className="form-control" value={formData.hoTen} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="ngaySinh">Ngày sinh:</label>
                    {}
                    <input type="date" id="ngaySinh" name="ngaySinh" className="form-control" value={formData.ngaySinh || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="gioiTinh">Giới tính:</label>
                    <select id="gioiTinh" name="gioiTinh" className="form-control" value={formData.gioiTinh} onChange={handleChange}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="diaChi">Địa chỉ:</label>
                    <input type="text" id="diaChi" name="diaChi" className="form-control" value={formData.diaChi || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="soDienThoai">Số điện thoại liên hệ:</label>
                    <input type="tel" id="soDienThoai" name="soDienThoai" className="form-control" value={formData.soDienThoai || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="ngheNghiep">Nghề nghiệp:</label>
                    <input type="text" id="ngheNghiep" name="ngheNghiep" className="form-control" value={formData.ngheNghiep || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="benhNen">Bệnh nền (nếu có, kể ra):</label>
                    <textarea id="benhNen" name="benhNen" className="form-control" value={formData.benhNen || ''} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="lyDoKham">Lý do đến khám:</label>
                    <textarea id="lyDoKham" name="lyDoKham" className="form-control" value={formData.lyDoKham || ''} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="tienSuNhaKhoa">Tiền sử nha khoa:</label>
                    <textarea id="tienSuNhaKhoa" name="tienSuNhaKhoa" className="form-control" value={formData.tienSuNhaKhoa || ''} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="chiTiet">Chi tiết khám/điều trị:</label>
                    <textarea id="chiTiet" name="chiTiet" className="form-control" value={formData.chiTiet || ''} onChange={handleChange}></textarea>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-submit-patient">
                        {mode === 'edit' ? 'Cập Nhật Hồ Sơ' : 'Lưu Hồ Sơ'}
                    </button>
                    {
                    {(mode === 'edit' || (mode === 'create' && initialData.hoTen)) && ( 
                         <button type="button" onClick={onCancel} className="btn btn-cancel">
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PatientForm;