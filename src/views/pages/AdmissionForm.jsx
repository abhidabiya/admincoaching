import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from 'config/constant';
import { IconUserQuestion  ,IconUserHeart  ,IconInfoCircle  ,IconCalendarWeek ,IconMail ,IconPhone  ,IconMapPin} from '@tabler/icons-react'
;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DARK = '#0f172a';
const DARK_UP = '#1e293b';
const DARK_MID = '#334155';
const PAGE_BG = '#f1f5f9';
const getAccent = (a) => a ? '#38bdf8' : '#ffc227';
const getAccentSoft = (a) => a ? 'rgba(56,189,248,0.08)' : 'rgba(251,191,36,0.08)';
const getAccentGlow = (a) => a ? 'rgba(56,189,248,0.15)' : 'rgba(251,191,36,0.15)';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REUSABLE PRIMITIVES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Row = ({ children, gap, style }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: gap || 18, ...style }}>{children}</div>
);

const FieldWrapper = ({ label, required, error, helperText, children, cols }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: cols ? `0 0 ${cols}%` : '1 1 0%', minWidth: 0 }}>
    {label && (
      <label style={{ fontSize: 12.5, fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}{required && <span style={{ color: '#ef4444', fontSize: 14 }}>*</span>}
      </label>
    )}
    {children}
    {error && <span style={{ fontSize: 11.5, color: '#ef4444', marginTop: -2 }}>{error}</span>}
    {helperText && !error && <span style={{ fontSize: 11.5, color: '#94a3b8', marginTop: -2 }}>{helperText}</span>}
  </div>
);

const wrapBase = (error, disabled) => ({
  display: 'flex', alignItems: 'center',
  border: `1.5px solid ${error ? '#ef4444' : '#d1d9e6'}`,
  borderRadius: 9, background: disabled ? '#f8fafc' : '#ffffff',
  overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s',
});

const onFoc = (e, error, disabled) => {
  if (disabled) return;
  e.currentTarget.style.borderColor = error ? '#ef4444' : '#94a3b8';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.06)';
};
const onBlr = (e, error) => {
  e.currentTarget.style.borderColor = error ? '#ef4444' : '#d1d9e6';
  e.currentTarget.style.boxShadow = 'none';
};

const TextInput = ({ icon, error, disabled, ...props }) => (
  <div style={wrapBase(error, disabled)} onFocus={e => onFoc(e, error, disabled)} onBlur={e => onBlr(e, error)}>
    {icon && <span style={{ paddingLeft: 12, color: '#94a3b8', fontSize: 15, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
    <input {...props} disabled={disabled} style={{
      flex: 1, border: 'none', outline: 'none', padding: '9px 14px', fontSize: 13.5,
      color: DARK, background: 'transparent', minWidth: 0, fontFamily: 'inherit', ...props.style,
    }} />
  </div>
);

const SelectInput = ({ error, disabled, children, ...props }) => (
  <div style={wrapBase(error, disabled)} onFocus={e => onFoc(e, error, disabled)} onBlur={e => onBlr(e, error)}>
    <select {...props} disabled={disabled} style={{
      width: '100%', border: 'none', outline: 'none', padding: '9px 36px 9px 14px', fontSize: 13.5,
      color: props.value ? DARK : '#94a3b8', background: 'transparent', fontFamily: 'inherit', appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    }}>{children}</select>
  </div>
);

const TextArea = ({ icon, error, disabled, ...props }) => (
  <div style={{ ...wrapBase(error, disabled), alignItems: 'flex-start' }} onFocus={e => onFoc(e, error, disabled)} onBlur={e => onBlr(e, error)}>
    {icon && <span style={{ paddingLeft: 12, paddingTop: 11, color: '#94a3b8', fontSize: 15, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
    <textarea {...props} disabled={disabled} style={{
      flex: 1, border: 'none', outline: 'none', resize: 'vertical', padding: '9px 14px', fontSize: 13.5,
      color: DARK, background: 'transparent', minWidth: 0, minHeight: 52, fontFamily: 'inherit',
    }} />
  </div>
);

const ReadOnlyField = ({ label, value, valueColor, cols }) => (
  <FieldWrapper label={label} cols={cols}>
    <div style={{
      padding: '9px 14px', fontSize: 13.5, fontWeight: 600, color: valueColor || DARK,
      background: '#f8fafc', borderRadius: 9, border: '1.5px solid #e8ecf1',
      minHeight: 38, display: 'flex', alignItems: 'center',
    }}>{value || '—'}</div>
  </FieldWrapper>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SNACKBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Snack = ({ open, message, severity, onClose }) => {
  if (!open) return null;
  const m = {
    success: { bg: '#ecfdf5', b: '#6ee7b7', t: '#065f46', i: '✓' },
    error:   { bg: '#fef2f2', b: '#fca5a5', t: '#991b1b', i: '✕' },
    warning: { bg: '#fffbeb', b: '#fcd34d', t: '#92400e', i: '⚠' },
    info:    { bg: '#eff6ff', b: '#93c5fd', t: '#1e40af', i: 'ℹ' },
  };
  const c = m[severity] || m.info;
  return (
    <div style={{
      position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
      background: c.bg, border: `1px solid ${c.b}`, borderRadius: 12,
      padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)', minWidth: 300, maxWidth: 500,
      animation: 'snackIn 0.3s ease',
    }}>
      <span style={{ width: 26, height: 26, borderRadius: '50%', background: c.b, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: c.t, flexShrink: 0 }}>{c.i}</span>
      <span style={{ flex: 1, fontSize: 13.5, color: c.t, fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: c.t, opacity: 0.5, padding: 0, lineHeight: 1 }}>×</button>
      <style>{`@keyframes snackIn{from{opacity:0;transform:translateX(-50%) translateY(-14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEFT PANEL — DARK SIDEBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DRow = ({ label, value, valueColor, noBorder }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '7px 0', borderBottom: noBorder ? 'none' : '1px solid rgba(255,255,255,0.05)',
  }}>
    <span style={{ fontSize: 12.5, color: '#64748b' }}>{label}</span>
    <span style={{ fontSize: 12.5, fontWeight: 600, color: valueColor || '#cbd5e1', textAlign: 'right', maxWidth: '58%', wordBreak: 'break-word' }}>
      {value || '—'}
    </span>
  </div>
);

const LeftPanel = ({ isAdmissionForm, handleFormTypeChange, formData, submitting, showRegistrationFee, handleRegistrationFee }) => {
  const acc = getAccent(isAdmissionForm);
  const accSoft = getAccentSoft(isAdmissionForm);
  const pending = parseFloat(formData.fees_pending) || 0;
  const total = parseFloat(formData.total_fees) || 0;
  const submitted = parseFloat(formData.fees_submitted) || 0;
  const regFee = parseFloat(formData.registration_fee) || 0;


 
  return (
    <div style={{
      width: 380, flexShrink: 0,
      background: `radial-gradient(ellipse at top center, ${getAccentGlow(isAdmissionForm)} 0%, ${DARK} 55%)`,
      borderRadius: 18, overflow: 'hidden', border: `1px solid ${DARK_MID}`,
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 24, maxHeight: 'calc(100vh - 48px)',
    }} className="lp">
      <div style={{ height: 3, background: `linear-gradient(90deg, ${acc}, ${isAdmissionForm ? '#818cf8' : '#f97316'})` }} />

      {/* Scrollable Content */}
      <div style={{ padding: '28px 24px 20px', flex: 1, overflowY: 'auto' }} className="lp-scroll">
        {/* Title */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
  {isAdmissionForm ? <><IconUserHeart style={{color : '#38bdf8'}} size={26} /> Admission Portal</> : <><IconUserQuestion size={26} style={{ color: '#fbbf24' }} /> Enquiry Portal</>}
</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            {isAdmissionForm ? 'Enroll a new student into the system' : 'Register an enquiry for course information'}
          </div>
        </div>

        {/* Segmented Toggle */}
        <div style={{ display: 'flex', position: 'relative', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          <div style={{
            position: 'absolute', top: 4,
            left: isAdmissionForm ? 'calc(50% - 0px)' : '4px',
            width: 'calc(50% - 4px)', height: 'calc(100% - 8px)',
            background: acc, borderRadius: 9,
            transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: `0 2px 10px ${acc}44`,
          }} />
          {[{ l: 'Enquiry', v: false }, { l: 'Admission', v: true }].map(x => (
            <button key={x.l} type="button" disabled={submitting}
              onClick={() => handleFormTypeChange({ target: { checked: x.v } })}
              style={{
                flex: 1, padding: '10px 0', fontSize: 13.5, fontWeight: 600,
                border: 'none', background: 'transparent', cursor: submitting ? 'not-allowed' : 'pointer',
                color: isAdmissionForm === x.v ? DARK : '#64748b',
                position: 'relative', zIndex: 1, fontFamily: 'inherit',
                transition: 'color 0.3s', borderRadius: 9, opacity: submitting ? 0.6 : 1,
              }}>{x.l}</button>
          ))}
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#5c6a7e', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>Form Summary</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '2px 16px' }}>
            <DRow label="Student" value={formData.name} />
            <DRow label="Contact" value={formData.contact_number} />
            <DRow label="Email" value={formData.email} />
            <DRow label="Course" value={formData.course_name} />
            {isAdmissionForm ? (
              <><DRow label="Qualification" value={formData.qualification} /><DRow label="Admission Date" value={formData.date_of_admission} /></>
            ) : (
              <DRow label="Enquiry Type" value={formData.enquiry_type} />
            )}
          </div>
        </div>

        {/* Fee Breakdown */}
        {(isAdmissionForm || showRegistrationFee) && (
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#5c6a7e', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>Fee Breakdown</div>
            <div style={{ background: accSoft, borderRadius: 12, padding: '2px 16px', border: `1px solid ${acc}18` }}>
              {isAdmissionForm ? (
                <>
                  <DRow label="Total Fees" value={`₹${total.toLocaleString()}`} valueColor={acc} />
                  <DRow label="Submitted" value={`₹${submitted.toLocaleString()}`} valueColor="#10b981" />
                  <DRow label="Pending" value={`₹${pending.toLocaleString()}`} valueColor={pending > 0 ? '#ef4444' : '#10b981'} noBorder />
                </>
              ) : (
                <>
                  <DRow label="Registration Fee" value={`₹${regFee.toLocaleString()}`} valueColor={acc} />
                  <DRow label="Status" value={pending === 0 ? '✅ Paid' : '⏳ Pending'} valueColor={pending === 0 ? '#10b981' : '#ef4444'} noBorder />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Buttons — always visible at bottom */}
      <div style={{ padding: '14px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {!isAdmissionForm && !showRegistrationFee && !formData.registration_fee && (
          <button type="button" onClick={handleRegistrationFee} disabled={submitting}
            style={{
              width: '100%', padding: '11px 20px', borderRadius: 10,
              border: `1.5px solid ${acc}`, background: 'transparent', color: acc,
              fontSize: 13.5, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginBottom: 10, transition: 'background 0.2s', opacity: submitting ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = accSoft; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >Pay ₹100 Registration Fee</button>
        )}
        <button type="submit" disabled={submitting}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 10, border: 'none',
            background: submitting ? DARK_MID : acc, color: DARK, fontSize: 14.5, fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            boxShadow: submitting ? 'none' : `0 4px 16px ${acc}44`,
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { if (!submitting) { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.boxShadow = `0 6px 24px ${acc}55`; }}}
          onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = submitting ? 'none' : `0 4px 16px ${acc}44`; }}
        >
          {submitting && <span style={{
            width: 16, height: 16, border: '2px solid rgba(15,23,42,0.2)',
            borderTopColor: DARK, borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block',
          }} />}
          {submitting ? 'Submitting...' : `Submit ${isAdmissionForm ? 'Admission' : 'Enquiry'}`}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
      </div>

      <style>{`
        .lp-scroll::-webkit-scrollbar{width:4px}
        .lp-scroll::-webkit-scrollbar-track{background:transparent}
        .lp-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px}
        .lp-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.14)}
      `}</style>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RIGHT PANEL — FORM SECTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SectionCard = ({ title, children, accentColor, style }) => (
  <div style={{
    background: '#ffffff', borderRadius: 12, marginBottom: 18,
    border: '1px solid #e2e8f0', borderLeft: `3px solid ${accentColor}`,
    overflow: 'hidden', ...style,
  }}>
    <div style={{ padding: '18px 22px 2px' }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: DARK, letterSpacing: '-0.2px' }}>{title}</span>
    </div>
    <div style={{ padding: '10px 22px 18px' }}>{children}</div>
  </div>
);

const PersonalDetailsSection = ({ formData, errors, handleChange, isAdmissionForm, submitting }) => {
const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];  
  
const cityOptions = [
  "Indore",
  "Bhopal",
  "Ujjain",
  "Dewas",
  "Ratlam",
  "Mandsaur",
  "Neemuch",
  "Shajapur",
  "Sehore",
  "Khandwa",
  "Khargone",
  "Burhanpur",
  "Dhar",
  "Jhabua",
  "Alirajpur",
  "Barwani",
  "Gwalior",
  "Jabalpur",
  "Sagar",
  "Rewa",
  "Satna",
  "Katni",
  "Chhindwara",
  "Betul",
  "Narmadapuram",
  "Vidisha",
  "Shivpuri",
  "Morena",
  "Bhind",
  "Singrauli",
]; 

return(
      <>
  <SectionCard title="Personal Information" accentColor={getAccent(isAdmissionForm)}>
    <Row>
      <FieldWrapper label="Student Name" required error={errors.name} cols={50}>
        <TextInput name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" error={!!errors.name} disabled={submitting} />
      </FieldWrapper>
      <FieldWrapper label="Email Address" error={errors.email} cols={50}>
        <TextInput name="email" type="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" icon={<IconMail size={18} />} error={!!errors.email} disabled={submitting} />
      </FieldWrapper>
    </Row>
    <Row style={{ marginTop: 16 }}>
      <FieldWrapper label="Date of Birth" required={isAdmissionForm} error={errors.date_of_birth} cols={isAdmissionForm ? 33 : 50}>
        <TextInput name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} icon={<IconCalendarWeek size={18}/>  } error={!!errors.date_of_birth} disabled={submitting} />
      </FieldWrapper>
      {isAdmissionForm && (
        <FieldWrapper label="Admission Date" required error={errors.date_of_admission} cols={33}>
          <TextInput name="date_of_admission" type="date" value={formData.date_of_admission} onChange={handleChange} error={!!errors.date_of_admission} disabled={submitting} />
        </FieldWrapper>
      )}
      <FieldWrapper label="Gender" error={errors.gender} cols={isAdmissionForm ? 33 : 50}>
        <SelectInput name="gender" value={formData.gender} onChange={handleChange} error={!!errors.gender} disabled={submitting}>
          <option value="">Select</option><option value="1">Male</option><option value="2">Female</option><option value="3">Other</option>
        </SelectInput>
      </FieldWrapper>

       <FieldWrapper label="Age"  error={errors.age}  cols={isAdmissionForm ? 33 : 50}>
          <SelectInput  name="age"  value={formData.age}  onChange={handleChange}  error={!!errors.age}  disabled={submitting}>
            <option value="">Select Age</option> {Array.from({ length: 100 }, (_, i) => (   <option key={i + 1} value={i + 1}>     {i + 1} Years</option>
              ))}
             </SelectInput>
       </FieldWrapper>
      
    </Row>
    <Row style={{ marginTop: 16 }}>
      <FieldWrapper label="State" error={errors.state} cols={isAdmissionForm ? 33 : 50}>
      <SelectInput name="state" value={formData.state} onChange={handleChange} error={!!errors.state} disabled={submitting} >
        <option value="">Select State</option>
        {stateOptions.map((state) => (<option key={state} value={state}>  {state}</option>))}
      </SelectInput>
      </FieldWrapper>
      <FieldWrapper label="City" error={errors.city} cols={isAdmissionForm ? 33 : 50}>
           <SelectInput name="city"  value={formData.city} onChange={handleChange} error={!!errors.city} disabled={submitting}>
             <option value="">Select City</option>{cityOptions.map((city) => (  <option key={city} value={city}> {city}  </option>
             ))}
           </SelectInput>
      </FieldWrapper>
    </Row>

    <Row style={{ marginTop: 16 }}>
      <FieldWrapper label="Contact Number" required error={errors.contact_number} cols={50}>
        <TextInput type='number' name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="XXXXXXX981" icon={<IconPhone size={18} />} error={!!errors.contact_number} disabled={submitting} />
      </FieldWrapper>
      <FieldWrapper  label="Parent/Guardian Number" required={isAdmissionForm} error={errors.parent_contact} cols={50}>
        <TextInput type='number' name="parent_contact" value={formData.parent_contact} onChange={handleChange} placeholder="XXXXXXX981" icon={<IconPhone size={18} />} error={!!errors.parent_contact} disabled={submitting} />
      </FieldWrapper>
    </Row>
    <div style={{ marginTop: 16 }}>
      <FieldWrapper label="Complete Address" error={errors.address}>
        <TextArea name="address" value={formData.address} onChange={handleChange} placeholder="House no, Street, City, State, Pincode" icon={<IconMapPin size={18} />} error={!!errors.address} disabled={submitting} rows={2} />
      </FieldWrapper>
    </div>
  </SectionCard>
  </>
)
};

const AcademicDetailsSection = ({ formData, errors, handleChange, isAdmissionForm, submitting, courses, loading, qualifications, enquiryTypes, timingSlots }) => (
  <SectionCard title={isAdmissionForm ? 'Academic Details' : 'Course Details'} accentColor={getAccent(isAdmissionForm)}>
    <Row>
      {isAdmissionForm ? (
        <FieldWrapper label="Highest Qualification" required error={errors.qualification} cols={50}>
          <SelectInput name="qualification" value={formData.qualification} onChange={handleChange} error={!!errors.qualification} disabled={submitting}>
            <option value="">Select</option>
            {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
          </SelectInput>
        </FieldWrapper>
      ) : (
        <FieldWrapper label="Enquiry Purpose" required error={errors.enquiry_type} cols={50}>
          <SelectInput name="enquiry_type" value={formData.enquiry_type} onChange={handleChange} error={!!errors.enquiry_type} disabled={submitting}>
            <option value="">Select</option>
            {enquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </SelectInput>
        </FieldWrapper>
      )}
      {isAdmissionForm || (
        <FieldWrapper label="Course" required error={errors.enquiry_type} cols={50}>
          <SelectInput name="course_name" value={formData.course_name}  error={!!errors.course_name} disabled={submitting}>
            <option value="">Select</option>
          </SelectInput>
        </FieldWrapper>
      )}
      
    </Row>
    {!isAdmissionForm && (
      <Row style={{ marginTop: 16 }}>
        <FieldWrapper label="Preferred Timing" cols={50}>
          <SelectInput name="preferred_timing" value={formData.preferred_timing} onChange={handleChange} disabled={submitting}>
            <option value="">Select</option>
            {timingSlots.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
        </FieldWrapper>
      </Row>
    )}
  </SectionCard>
);

const AcademicCourseDetails = ({formData,errors,handleChange,isAdmissionForm,submitting,qualifications,}) =>
  isAdmissionForm ? (
    <SectionCard title="Course Details" accentColor={getAccent(true)}>
      <Row>
        <FieldWrapper label="Select Course" required error={errors.qualification} cols={isAdmissionForm ? 45 :50} >
          <SelectInput  name="qualification"  value={formData.qualification}  onChange={handleChange}  error={!!errors.qualification}  disabled={submitting}>
            <option value="">Select</option>
          </SelectInput>
        </FieldWrapper>
         <FieldWrapper label="Select Teacher" required error={errors.qualification} cols={isAdmissionForm ? 45 : 50} >
          <SelectInput  name="qualification"  value={formData.qualification}  onChange={handleChange}  error={!!errors.qualification}  disabled={submitting}>
            <option value="">Select</option>
          </SelectInput>
        </FieldWrapper>
         <FieldWrapper label="Batch Start Date" required error={errors.qualification} cols={isAdmissionForm ? 45 : 50} >
          <TextInput name="date_of_admission" type="date" value={formData.date_of_admission}  error={!!errors.date_of_admission} disabled={submitting} />
        </FieldWrapper>
         <FieldWrapper label="Batch End Date" required error={errors.qualification} cols={isAdmissionForm ? 45 : 50}  >
          <TextInput name="date_of_admission" type="date" value={formData.date_of_admission}  error={!!errors.date_of_admission} disabled={submitting} />
        </FieldWrapper>
      </Row>
    </SectionCard>
  ) : null;



const FeesDetailsSection = ({ formData, errors, handleChange, isAdmissionForm, submitting, showRegistrationFee, paymentModes }) => {
  if (!isAdmissionForm && !showRegistrationFee) return null;
  return (
    <SectionCard title={isAdmissionForm ? 'Fees Structure' : 'Registration Fee'} accentColor={DARK}>
      <Row>
        {isAdmissionForm ? (
          <>
            <FieldWrapper label="Total Course Fees" required error={errors.total_fees} cols={33}>
              <TextInput name="total_fees" type="number" value={formData.total_fees} onChange={handleChange} icon="₹" error={!!errors.total_fees} disabled={submitting} />
            </FieldWrapper>
            <FieldWrapper label="Fees Submitted" error={errors.fees_submitted} cols={33}>
              <TextInput name="fees_submitted" type="number" value={formData.fees_submitted} onChange={handleChange} icon="₹" error={!!errors.fees_submitted} disabled={submitting} />
            </FieldWrapper>
            <ReadOnlyField label="Fees Pending" value={`₹${(parseFloat(formData.fees_pending) || 0).toLocaleString()}`} valueColor={(parseFloat(formData.fees_pending) || 0) > 0 ? '#dc2626' : '#16a34a'} cols={33} />
          </>
        ) : (
          <>
            <FieldWrapper label="Registration Fee" error={errors.registration_fee} cols={50}>
              <TextInput name="registration_fee" value={formData.registration_fee || 100} onChange={handleChange} icon="₹" disabled={submitting || showRegistrationFee} style={{ fontWeight: 700, color: getAccent(false) }} />
            </FieldWrapper>
            <ReadOnlyField label="Payment Status" value={parseFloat(formData.fees_pending || 0) === 0 ? '✅ Paid' : '⏳ Pending'} valueColor={parseFloat(formData.fees_pending || 0) === 0 ? '#16a34a' : '#dc2626'} cols={50} />
          </>
        )}
      </Row>
      <Row style={{ marginTop: 16 }}>
        <FieldWrapper label="Payment Mode" cols={50}>
          <SelectInput name="payment_mode" value={formData.payment_mode} onChange={handleChange} disabled={submitting}>
            <option value="">Select</option>
            {paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
          </SelectInput>
        </FieldWrapper>
        <FieldWrapper label="Payment Date" cols={50}>
          <TextInput name="payment_date" type="date" value={formData.payment_date} onChange={handleChange} disabled={submitting} />
        </FieldWrapper>
      </Row>
    </SectionCard>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AdmissionForm = () => {
  const [isAdmissionForm, setIsAdmissionForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  const [showRegistrationFee, setShowRegistrationFee] = useState(false);

  const [formData, setFormData] = useState({
    name: '', address: '', contact_number: '', parent_contact: '',
    date_of_birth: '', email: '', gender: '', qualification: '',
    course_name: '', date_of_admission: new Date().toISOString().split('T')[0],
    total_fees: '', fees_submitted: '', fees_pending: '',
    payment_mode: '', payment_date: new Date().toISOString().split('T')[0],
    enquiry_type: '', preferred_timing: '', registration_fee: '',
    admission_type: 1, student_status: 3, admission_step: 0,
  });

  const qualifications = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'Other'];
  const enquiryTypes = ['Course Information', 'Fee Structure', 'Batch Timings', 'Faculty Details', 'Infrastructure', 'Scholarship', 'Other'];
  const timingSlots = ['Morning (7 AM - 10 AM)', 'Afternoon (2 PM - 5 PM)', 'Evening (5 PM - 8 PM)', 'Weekend Batch', 'Flexible Timing'];
  const paymentModes = ['Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card', 'Bank Transfer'];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API_URL}get_all_courses`, { params: { page: 1, limit: 100, active: 1 } });
      if (r.data.success) setCourses(r.data.data || []);
      else setSnackbar({ open: true, message: 'Failed to fetch courses', severity: 'error' });
    } catch (e) {
      console.error('Error fetching courses:', e);
      setSnackbar({ open: true, message: 'Error fetching courses', severity: 'error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const resetForm = (isAdm) => setFormData({
    name: '', address: '', contact_number: '', parent_contact: '',
    date_of_birth: '', email: '', gender: '', qualification: '',
    course_name: '', date_of_admission: new Date().toISOString().split('T')[0],
    total_fees: '', fees_submitted: '', fees_pending: '',
    payment_mode: '', payment_date: new Date().toISOString().split('T')[0],
    enquiry_type: '', preferred_timing: '', registration_fee: '',
    admission_type: isAdm ? 1 : 0, student_status: isAdm ? 3 : 0, admission_step: 0,
  });

  const handleFormTypeChange = (event) => {
    const isAdm = event.target.checked;
    setIsAdmissionForm(isAdm);
    setErrors({});
    resetForm(isAdm);
    setShowRegistrationFee(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    let u = { ...formData, [name]: value };
    if (name === 'total_fees' || name === 'fees_submitted') {
      u.fees_pending = ((parseFloat(u.total_fees) || 0) - (parseFloat(u.fees_submitted) || 0)).toFixed(2);
    }
    if (name === 'course_name' && isAdmissionForm) {
      const sel = courses.find(c => c.course_name === value);
      if (sel) {
        u.total_fees = sel.fees || '';
        u.fees_pending = ((parseFloat(sel.fees) || 0) - (parseFloat(u.fees_submitted) || 0)).toFixed(2);
      }
    }
    setFormData(u);
  };

  const handleRegistrationFee = () => {
    setShowRegistrationFee(true);
    setFormData(p => ({ ...p, registration_fee: '100', total_fees: '100', fees_submitted: '0', fees_pending: '100' }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Student name is required';
    if (!formData.contact_number.trim()) e.contact_number = 'Contact number is required';
    else if (!/^\d{10}$/.test(formData.contact_number)) e.contact_number = 'Enter a valid 10-digit mobile number';
    if (!formData.course_name) e.course_name = 'Course selection is required';
    if (isAdmissionForm) {
      if (!formData.parent_contact.trim()) e.parent_contact = 'Parent/Guardian number is required';
      else if (!/^\d{10}$/.test(formData.parent_contact)) e.parent_contact = 'Enter a valid 10-digit mobile number';
      if (!formData.date_of_birth) e.date_of_birth = 'Date of birth is required';
      if (!formData.qualification) e.qualification = 'Qualification is required';
      if (!formData.date_of_admission) e.date_of_admission = 'Admission date is required';
      if (!formData.total_fees || parseFloat(formData.total_fees) <= 0) e.total_fees = 'Total fees must be greater than 0';
      if (formData.fees_submitted && parseFloat(formData.fees_submitted) < 0) e.fees_submitted = 'Fees submitted cannot be negative';
      if (formData.fees_submitted && parseFloat(formData.fees_submitted) > parseFloat(formData.total_fees)) e.fees_submitted = 'Submitted fees cannot exceed total fees';
    } else {
      if (!formData.enquiry_type) e.enquiry_type = 'Enquiry type is required';
      if (!showRegistrationFee && !formData.registration_fee) e.registration_fee = 'Registration fee is required';
      else if (formData.registration_fee && parseFloat(formData.registration_fee) !== 100) e.registration_fee = 'Registration fee must be ₹100';
    }
    return e;
  };

  const prepareApiData = () => {
    const admission_type = isAdmissionForm ? 1 : 0;
    const total_fees = parseFloat(formData.total_fees) || 0;
    const fees_submitted = parseFloat(formData.fees_submitted) || 0;
    const registration_fee = parseFloat(formData.registration_fee) || 0;
    const fT = admission_type === 0 && registration_fee > 0 ? registration_fee : total_fees;
    let step = 0;
    if (admission_type === 0 && registration_fee > 0 && fees_submitted >= registration_fee) step = 1;
    else if (admission_type === 1 && fees_submitted > 0) step = 2;
    const d = {
      admission_type, name: formData.name, address: formData.address,
      contact_number: formData.contact_number, parent_contact: formData.parent_contact,
      date_of_birth: formData.date_of_birth, qualification: formData.qualification,
      course_name: formData.course_name, date_of_admission: formData.date_of_admission,
      total_fees: fT, fees_submitted, enquiry_type: formData.enquiry_type,
      preferred_timing: formData.preferred_timing, registration_fee,
      payment_mode: formData.payment_mode, payment_date: formData.payment_date,
      email: formData.email, gender: formData.gender ? parseInt(formData.gender) : 1,
      student_status: admission_type === 1 ? 3 : 0, admission_step: step,
    };
    Object.keys(d).forEach(k => { if (d[k] === '' || d[k] === undefined) delete d[k]; });
    return d;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const vErr = validateForm();
    if (Object.keys(vErr).length > 0) {
      setErrors(vErr);
      setSnackbar({ open: true, message: 'Please fix the errors in the form', severity: 'error' });
      return;
    }
    if (!isAdmissionForm && !showRegistrationFee && !formData.registration_fee) {
      if (window.confirm('Do you want to pay ₹100 registration fee to proceed with the enquiry?')) { handleRegistrationFee(); return; }
      setSnackbar({ open: true, message: 'Registration fee is required to process your enquiry', severity: 'warning' });
      return;
    }
    setSubmitting(true);
    try {
      const r = await axios.post(`${API_URL}create_student_record`, prepareApiData(), { headers: { 'Content-Type': 'application/json' } });
      if (r.data.success) {
        setSnackbar({ open: true, message: r.data.message || (isAdmissionForm ? 'Admission created successfully!' : 'Enquiry created successfully!'), severity: 'success' });
        resetForm(isAdmissionForm);
        setShowRegistrationFee(false);
        setErrors({});
      } else {
        setSnackbar({ open: true, message: r.data.message || 'Submission failed', severity: 'error' });
      }
    } catch (err) {
      console.error('API Error:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.response?.data?.error || 'Network error. Please try again.', severity: 'error' });
    } finally { setSubmitting(false); }
  };

  const acc = getAccent(isAdmissionForm);

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter','Segoe UI',-apple-system,sans-serif" }}>
      {/* Top bar */}
      {/* <div style={{ height: 3, background: `linear-gradient(90deg, ${acc}, ${isAdmissionForm ? '#818cf8' : '#f97316'})` }} /> */}

      <Snack open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} />

      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: 1260, margin: '0 auto', padding: '32px 24px 60px', display: 'flex', gap: 28, alignItems: 'flex-start' }} className="fl">

          {/* ── LEFT PANEL ── */}
          <LeftPanel
            isAdmissionForm={isAdmissionForm}
            handleFormTypeChange={handleFormTypeChange}
            formData={formData}
            submitting={submitting}
            showRegistrationFee={showRegistrationFee}
            handleRegistrationFee={handleRegistrationFee}
          />

          {/* ── RIGHT PANEL ── */}
          <div style={{ flex: 1, minWidth: 0 }} className="rp">
            {/* Enquiry notice */}
            {!isAdmissionForm && (
              <div style={{
                background: getAccentSoft(false), border: `1px solid ${getAccent(false)}30`,
                borderRadius: 12, padding: '14px 18px', marginBottom: 18,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}><IconInfoCircle size={19} color="#3b82f6" /></span>
                <span style={{ fontSize: 13, color: '#a89d95', lineHeight: 1.5 }}>
                  <strong>Note:</strong> A registration fee of ₹100 is required to process your enquiry.
                  This amount will be adjusted against your admission fees if you choose to enroll later.
                </span>
              </div>
            )}

            {/* Section header */}
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                 {isAdmissionForm ? <><IconUserHeart size={22}  color='#38bdf8' /> Student Details</> : <><IconUserQuestion size={22} color='#fbbf24' /> Enquiry Details</>}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Please fill all the required fields carefully</p>
              <div style={{ width: 36, height: 2.5, borderRadius: 2, background: acc, margin: '10px 0 0', opacity: 0.6 }} />
            </div>

            <PersonalDetailsSection formData={formData} errors={errors} handleChange={handleChange} isAdmissionForm={isAdmissionForm} submitting={submitting} />
            <AcademicDetailsSection formData={formData} errors={errors} handleChange={handleChange} isAdmissionForm={isAdmissionForm} submitting={submitting} courses={courses} loading={loading} qualifications={qualifications} enquiryTypes={enquiryTypes} timingSlots={timingSlots} />
            <AcademicCourseDetails formData={formData} errors={errors} handleChange={handleChange} isAdmissionForm={isAdmissionForm} submitting={submitting} courses={courses} loading={loading} qualifications={qualifications} enquiryTypes={enquiryTypes} timingSlots={timingSlots} />
            <FeesDetailsSection formData={formData} errors={errors} handleChange={handleChange} isAdmissionForm={isAdmissionForm} submitting={submitting} showRegistrationFee={showRegistrationFee} paymentModes={paymentModes} />
            
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11.5, color: '#94a3b8' }}>
            </div>
              All information provided will be kept confidential and used only for admission/enquiry purposes.
          </div>
        </div>
      </form>

      {/* Responsive */}
      <style>{`
        @media(max-width:1024px){
          .fl{flex-direction:column!important}
          .lp{position:static!important;width:100%!important;max-height:none!important}
          .rp{width:100%!important}
        }
      `}</style>
    </div>
  );
};

export default AdmissionForm;