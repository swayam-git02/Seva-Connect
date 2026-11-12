// Ye component SevaConnect ka professional Dummy Payment Gateway modal hai.
// Customer ya Provider online payment (UPI, Cards, Netbanking, Doorstep Cash) simulate kar sakte hain.
// Payment confirm hone par backend booking status ko 'completed' aur payment_status ko 'PAID' karta hai,
// aur dono customer aur provider portals ko automatically respective dashboard par redirect karta hai.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  X,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import bookingService from '../../services/bookingService';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';

export const DummyPaymentGatewayModal = ({
  isOpen,
  onClose,
  booking,
  userRole = 'customer', // 'customer' | 'provider'
  onPaymentSuccess,
}) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  // Active payment mode tab: 'upi' | 'card' | 'netbanking' | 'cash'
  const [activeTab, setActiveTab] = useState('upi');
  const [upiSubTab, setUpiSubTab] = useState('qr'); // 'qr' | 'id'
  const [upiIdInput, setUpiIdInput] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 8820 1204 9821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardName, setCardName] = useState('');

  // Processing & countdown states
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Initialize customer name & UPI on modal open
  useEffect(() => {
    if (booking) {
      const name = booking.customerName || 'Customer';
      setCardName(name);
      setUpiIdInput(`${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@okaxis`);
      setTransactionId(`TXN_${Date.now().toString().slice(-8)}`);
    }
  }, [booking, isOpen]);

  // Handle countdown and auto-redirection on success
  useEffect(() => {
    let timer;
    if (paymentState === 'success') {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        // Countdown reached 0: redirect immediately
        handleRedirectToDashboard();
      }
    }
    return () => clearTimeout(timer);
  }, [paymentState, countdown]);

  if (!isOpen || !booking) return null;

  const totalAmount = Number(booking.totalPrice || 0);

  // Cross-tab sync: notify other open tabs (provider or customer) that payment is done
  const broadcastPaymentEvent = (result) => {
    const eventPayload = {
      type: 'SEVACONNECT_PAYMENT_COMPLETED',
      bookingId: booking.id,
      timestamp: Date.now(),
      status: 'completed',
      paymentStatus: 'PAID',
      amount: totalAmount,
      userRole,
    };

    try {
      localStorage.setItem('sevaconnect_payment_event', JSON.stringify(eventPayload));
      window.dispatchEvent(new CustomEvent('sevaconnect_payment_sync', { detail: eventPayload }));
    } catch (e) {
      console.warn('LocalStorage broadcast error:', e);
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('sevaconnect_booking_channel');
        bc.postMessage(eventPayload);
        bc.close();
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }
  };

  // Redirect to the respective role dashboard
  const handleRedirectToDashboard = () => {
    if (onClose) onClose();
    if (userRole === 'provider') {
      navigate(ROUTES.PROVIDER_DASHBOARD);
    } else {
      navigate(ROUTES.CUSTOMER_DASHBOARD);
    }
  };

  // Execute payment simulation
  const handleProcessPayment = async () => {
    setPaymentState('processing');
    setStatusMessage('Connecting to Secure Banking Gateway...');

    try {
      // Realistic simulation delays
      await new Promise((r) => setTimeout(r, 600));
      setStatusMessage('Authorizing transaction with Bank / NPCI...');
      await new Promise((r) => setTimeout(r, 700));

      const payload = {
        paymentMode: activeTab === 'cash' ? 'CASH' : activeTab === 'upi' ? 'UPI' : activeTab === 'card' ? 'CARD' : 'NETBANKING',
        transactionId,
        amount: totalAmount,
      };

      const result = await bookingService.collectPayment(booking.id, payload);

      // Broadcast across tabs so the other party's window auto-closes
      broadcastPaymentEvent(result);

      if (onPaymentSuccess) {
        onPaymentSuccess(result);
      }

      setPaymentState('success');
      showSuccess('Payment Successful!', `₹${totalAmount} paid successfully. Booking closed.`);
    } catch (err) {
      setPaymentState('error');
      setStatusMessage(err.message || 'Payment processing failed. Please try again.');
      showError('Payment Failed', err.message || 'Unable to process payment.');
    }
  };

  const banks = [
    { id: 'HDFC', name: 'HDFC Bank', code: '01' },
    { id: 'SBI', name: 'State Bank of India', code: '02' },
    { id: 'ICICI', name: 'ICICI Bank', code: '03' },
    { id: 'AXIS', name: 'Axis Bank', code: '04' },
    { id: 'KOTAK', name: 'Kotak Mahindra', code: '05' },
    { id: 'PNB', name: 'Punjab National Bank', code: '06' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => paymentState !== 'processing' && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-200 animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-brand-800">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center">
                <Lock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">SevaPay Gateway</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    TEST SIMULATOR
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>256-Bit SSL Encrypted • NPCI / RBI Compliant</span>
                </div>
              </div>
            </div>

            {paymentState !== 'processing' && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* SUCCESS STATE DISPLAY */}
          {paymentState === 'success' ? (
            <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  TRANSACTION APPROVED
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  {formatCurrency(totalAmount)}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Payment for <strong>{booking.serviceTitle}</strong> (#{booking.id}) successfully processed!
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Status:</span>
                  <span className="font-bold text-emerald-700">COMPLETED & CLOSED ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{activeTab.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid By / For:</span>
                  <span className="font-semibold text-slate-800">{booking.customerName}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-900">
                <p className="font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  <span>
                    Auto-redirecting to {userRole === 'provider' ? 'Provider' : 'Customer'} Dashboard in {countdown}s...
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleRedirectToDashboard}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : paymentState === 'processing' ? (
            /* PROCESSING STATE DISPLAY */
            <div className="p-12 text-center space-y-5">
              <div className="mx-auto h-16 w-16 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Processing Payment...</h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">{statusMessage}</p>
              </div>
              <p className="text-[11px] text-slate-400">
                Please do not refresh the page or press back button.
              </p>
            </div>
          ) : (
            /* MAIN PAYMENT FORM */
            <div className="p-5 sm:p-6 space-y-5">
              {/* Order Summary Strip */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Amount Payable
                  </span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {formatCurrency(totalAmount)}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Job #{booking.id} • {booking.serviceTitle}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-medium">Customer</span>
                  <span className="text-xs font-bold text-slate-800 block">{booking.customerName}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5 font-semibold">
                    100% Guaranteed
                  </span>
                </div>
              </div>

              {/* Payment Methods Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activeTab === 'upi'
                      ? 'bg-white text-brand-700 shadow-sm font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activeTab === 'card'
                      ? 'bg-white text-brand-700 shadow-sm font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activeTab === 'netbanking'
                      ? 'bg-white text-brand-700 shadow-sm font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cash')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activeTab === 'cash'
                      ? 'bg-white text-brand-700 shadow-sm font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Banknote className="h-4 w-4" />
                  <span>Cash</span>
                </button>
              </div>

              {/* TAB 1: UPI / QR CODE */}
              {activeTab === 'upi' && (
                <div className="space-y-4 pt-1">
                  <div className="flex border-b border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('qr')}
                      className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                        upiSubTab === 'qr'
                          ? 'border-brand-600 text-brand-700'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Scan QR Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('id')}
                      className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                        upiSubTab === 'id'
                          ? 'border-brand-600 text-brand-700'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>UPI ID / VPA</span>
                    </button>
                  </div>

                  {upiSubTab === 'qr' ? (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-3">
                      {/* Realistic Simulated QR Code SVG */}
                      <div className="mx-auto w-44 h-44 bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-inner flex flex-col items-center justify-center relative group">
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                          {/* Corner Squares */}
                          <rect x="5" y="5" width="28" height="28" rx="4" />
                          <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                          <rect x="13" y="13" width="12" height="12" rx="1" />

                          <rect x="67" y="5" width="28" height="28" rx="4" />
                          <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                          <rect x="75" y="13" width="12" height="12" rx="1" />

                          <rect x="5" y="67" width="28" height="28" rx="4" />
                          <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                          <rect x="13" y="75" width="12" height="12" rx="1" />

                          {/* Data Matrix Dots */}
                          <rect x="38" y="10" width="6" height="6" />
                          <rect x="50" y="8" width="8" height="8" />
                          <rect x="40" y="24" width="8" height="8" />
                          <rect x="54" y="22" width="6" height="6" />

                          <rect x="10" y="38" width="6" height="6" />
                          <rect x="22" y="42" width="8" height="8" />
                          <rect x="8" y="52" width="8" height="8" />
                          <rect x="24" y="54" width="6" height="6" />

                          <rect x="38" y="38" width="24" height="24" rx="4" fill="#059669" />
                          <circle cx="50" cy="50" r="7" fill="white" />

                          <rect x="68" y="40" width="8" height="8" />
                          <rect x="82" y="44" width="8" height="8" />
                          <rect x="70" y="54" width="6" height="6" />
                          <rect x="84" y="56" width="6" height="6" />

                          <rect x="38" y="68" width="8" height="8" />
                          <rect x="52" y="72" width="8" height="8" />
                          <rect x="40" y="84" width="6" height="6" />
                          <rect x="54" y="82" width="6" height="6" />

                          <rect x="68" y="68" width="6" height="6" />
                          <rect x="80" y="70" width="8" height="8" />
                          <rect x="72" y="84" width="8" height="8" />
                          <rect x="86" y="84" width="6" height="6" />
                        </svg>

                        <div className="absolute inset-x-2 bottom-2 bg-emerald-600/90 text-white text-[9px] font-bold py-0.5 rounded shadow">
                          SEVACONNECT BHIM UPI
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Scan with any UPI App</span>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <span
                            key={app}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Enter your Virtual Payment Address (UPI ID)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:outline-none bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                          <button
                            key={suf}
                            type="button"
                            onClick={() => {
                              const prefix = upiIdInput.split('@')[0] || 'swayam';
                              setUpiIdInput(`${prefix}${suf}`);
                            }}
                            className="text-[10px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-600"
                          >
                            {suf}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARD */}
              {activeTab === 'card' && (
                <div className="space-y-4 pt-1">
                  {/* Card Visual Preview */}
                  <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-brand-900 p-4 rounded-xl text-white shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold tracking-wider text-slate-300">DEBIT / CREDIT</span>
                      <span className="font-black text-amber-300 text-sm tracking-wider">RuPay / VISA</span>
                    </div>

                    <div className="h-6 w-9 rounded bg-amber-400/80 border border-amber-300/40" />

                    <div className="font-mono text-base tracking-[0.25em] font-bold text-white">
                      {cardNumber}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div>
                        <span className="text-[9px] uppercase block text-slate-400">Cardholder</span>
                        <span className="font-semibold text-white">{cardName || 'Cardholder Name'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase block text-slate-400">Expires</span>
                        <span className="font-mono font-semibold text-white">{cardExpiry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8820 1204 9821"
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-mono text-xs focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/29"
                          className="w-full py-2 px-3 rounded-lg border border-slate-300 font-mono text-xs focus:border-brand-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full py-2 px-3 rounded-lg border border-slate-300 font-mono text-xs focus:border-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Select Your Bank:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {banks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          selectedBank === b.id
                            ? 'border-brand-500 bg-brand-50/70 text-brand-950 ring-2 ring-brand-500/20 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span>{b.name}</span>
                        {selectedBank === b.id && <Check className="h-4 w-4 text-brand-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DOORSTEP CASH */}
              {activeTab === 'cash' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-950">Pay Cash at Doorstep</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Hand over physical cash of <strong>{formatCurrency(totalAmount)}</strong> directly to the service technician upon completion of work.
                  </p>
                </div>
              )}

              {/* Error Callout if any */}
              {paymentState === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    Pay {formatCurrency(totalAmount)} & Close Booking
                  </span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Clicking pay will close booking on both Customer & Provider portals and redirect to dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DummyPaymentGatewayModal;

