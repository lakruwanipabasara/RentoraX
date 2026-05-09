import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Star, X } from 'lucide-react';

export default function ItemCard({ item, userRole }) {
  const [showRentModal, setShowRentModal] = useState(false);

  const [rentForm, setRentForm] = useState({
    startDate: '',
    endDate: '',
    protection: 'Included'
  });

  const API_BASE_URL = "http://localhost:8086";
  const today = new Date().toISOString().split("T")[0];

  const handleRentClick = (e) => {
    e.stopPropagation();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || !savedUser.id) {
      alert("Please login first");
      return;
    }

    if (savedUser.role === "ADMIN") {
      alert("Admin cannot rent products");
      return;
    }

    setShowRentModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setRentForm({
        ...rentForm,
        startDate: value,
        endDate: rentForm.endDate && rentForm.endDate < value ? '' : rentForm.endDate
      });
      return;
    }

    setRentForm({
      ...rentForm,
      [name]: value
    });
  };

  const calculateDuration = () => {
    if (!rentForm.startDate || !rentForm.endDate) return 0;

    const start = new Date(rentForm.startDate);
    const end = new Date(rentForm.endDate);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  };

  const duration = calculateDuration();
  const rentAmount = duration * Number(item.price || 0);
  const depositAmount = Number(item.deposit || 0);
  const fullAmount = rentAmount + depositAmount;

  const handleAddToMyBooking = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || !savedUser.id) {
      alert("Please login first");
      return;
    }

    if (!rentForm.startDate || !rentForm.endDate) {
      alert("Please select start date and end date");
      return;
    }

    if (rentForm.startDate < today) {
      alert("Start date cannot be a past date");
      return;
    }

    if (rentForm.endDate < today) {
      alert("End date cannot be a past date");
      return;
    }

    if (rentForm.endDate < rentForm.startDate) {
      alert("End date must be after start date");
      return;
    }

    if (duration <= 0) {
      alert("Please select valid dates");
      return;
    }

    try {
      const bookingData = {
        userId: savedUser.id,
        itemId: item.id,
        title: item.title,
        status: "Pending",
        period: `${rentForm.startDate} - ${rentForm.endDate}`,
        dateRange: `${rentForm.startDate} - ${rentForm.endDate}`,
        duration: duration,
        total: fullAmount,
        deposit: depositAmount,
        protection: rentForm.protection,
        image: item.image,
        returnSoon: false,
        daysRemaining: duration
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        bookingData
      );

      if (response.data.success) {
        alert("Rent request sent to admin");

        setShowRentModal(false);

        setRentForm({
          startDate: '',
          endDate: '',
          protection: 'Included'
        });
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error("Add Booking Error:", error);
      alert("Failed to send rent request");
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
        <div className="relative h-48 bg-gray-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
            {item.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {item.description || ''}
          </p>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              {item.rating || 'N/A'}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-end">
            <div>
              <div className="text-teal-700 font-bold text-xl">
                Rs. {Number(item.price || 0).toFixed(2)}
                <span className="text-gray-400 text-sm font-normal">/day</span>
              </div>

              {item.deposit && (
                <div className="text-[10px] text-gray-400 font-medium">
                  Rs. {Number(item.deposit || 0).toFixed(2)} deposit
                </div>
              )}
            </div>

            {userRole !== "ADMIN" && (
              <button
                onClick={handleRentClick}
                className="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-800 transition shadow-md active:scale-95"
              >
                Rent Now
              </button>
            )}
          </div>
        </div>
      </div>

      {showRentModal &&
        createPortal(
          <div
            onClick={() => setShowRentModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 80px rgba(0,0,0,0.35)'
              }}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Rental Request
                  </h2>

                  <p className="text-sm text-gray-500">
                    Select your rental period and review payment summary
                  </p>
                </div>

                <button
                  onClick={() => setShowRentModal(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded-xl object-cover bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-white flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {item.description || "No description available"}
                    </p>

                    <div className="mt-3 text-sm">
                      <span className="font-bold text-teal-700">
                        Rs. {Number(item.price || 0).toFixed(2)}
                      </span>
                      <span className="text-gray-400"> / day</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={rentForm.startDate}
                      min={today}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      End Date
                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={rentForm.endDate}
                      min={rentForm.startDate || today}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div className="bg-[#F8FCFC] rounded-2xl border border-teal-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-teal-100">
                    <h3 className="font-black text-gray-900">
                      Payment Summary
                    </h3>
                  </div>

                  <div className="p-5 space-y-3">
                    <SummaryRow
                      label="Rental Duration"
                      value={`${duration} ${duration === 1 ? "day" : "days"}`}
                    />

                    <SummaryRow
                      label="Daily Rate"
                      value={`Rs. ${Number(item.price || 0).toFixed(2)}`}
                    />

                    <SummaryRow
                      label="Rental Amount"
                      value={`Rs. ${rentAmount.toFixed(2)}`}
                    />

                    <SummaryRow
                      label="Security Deposit"
                      value={`Rs. ${depositAmount.toFixed(2)}`}
                    />

                    <div className="border-t border-teal-100 pt-4 mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Total Payable
                        </p>

                        <p className="text-xs text-gray-400">
                          Rental amount + refundable deposit
                        </p>
                      </div>

                      <p className="text-2xl font-black text-teal-800">
                        Rs. {fullAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToMyBooking}
                  className="w-full bg-teal-700 text-white py-3 rounded-xl font-bold hover:bg-teal-800 transition"
                >
                  Send Rent Request
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  );
}