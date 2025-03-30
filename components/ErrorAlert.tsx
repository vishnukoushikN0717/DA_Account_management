// components/ErrorAlert.tsx
interface ErrorAlertProps {
    message: string;
    onClose: () => void;
    onTryDifferent: () => void;
}

export function ErrorAlert({ message, onClose, onTryDifferent }: ErrorAlertProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 dark:bg-black/40">
            <div className="bg-white dark:bg-[#1a1f2d] rounded-lg shadow-2xl w-[500px] transform transition-all animate-slide-up">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <svg
                                className="w-7 h-7 text-red-500"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                {/* Authentication Error */}
                                This Account Doesn't Exist
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Error Message */}
                    <div className="bg-red-50 dark:bg-[#2A1515] rounded-lg p-5 mb-6">
                        <p className="text-red-600 dark:text-[#ff6b6b] text-lg font-medium">
                            Please Check the E-mail ID Entered
                        </p>
                    </div>

                    {/* Support Message */}
                    <div className="mb-8">
                        <p className="text-gray-700 dark:text-gray-400 text-m mb-3">
                            {/* This Account doesn't exist, */}
                            Please connect with our support team for assistance:
                        </p>
                        <a
                            href="mailto:admin@doctoralliance.com"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-[#4d9fff] dark:hover:text-blue-400 transition-colors text-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <span className="font-medium">admin@doctoralliance.com</span>
                        </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onTryDifferent}
                            className="px-8 py-3 text-base font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-[#E53935] dark:hover:bg-red-700 rounded-md transition-colors"
                        >
                            Try With Different ID
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
