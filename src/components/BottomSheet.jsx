import { useEffect, useCallback, useRef } from "react";
import { Camera, Upload } from "lucide-react";

/**
 * BottomSheetModal
 *
 * A modal bottom sheet that floats on top of the page content,
 * matching the provided design (rounded top corners, drag handle,
 * two option rows with icon + label).
 *
 * Props:
 * - open: boolean - whether the sheet is visible
 * - onClose: () => void - called when the backdrop or Esc is pressed
 * - options: Array<{
 *     key, label, icon: ReactNode,
 *     onClick?: () => void,               // fired for any option
 *     type?: "file",                      // if set, tapping opens the device file/camera picker
 *     accept?: string,                    // e.g. "image/*"
 *     capture?: string,                   // e.g. "environment" to prefer the camera on mobile
 *     onFileSelect?: (file: File) => void // fired with the chosen file
 *   }>
 *     Defaults to the two options shown in the design (camera / upload).
 */
export default function BottomSheetModal({
    open,
    onClose,
    options = [
        {
            key: "camera",
            label: "사진 촬영하기",
            icon: <Camera size={24} strokeWidth={2} color="#383131" />,
            type: "file",
            accept: "image/*",
            capture: "environment",
            onFileSelect: (file) => console.log("촬영한 사진:", file),
        },
        {
            key: "upload",
            label: "파일 업로드하기",
            icon: <Upload size={24} strokeWidth={2} color="#383131" />,
            type: "file",
            accept: "image/*",
            onFileSelect: (file) => console.log("업로드한 파일:", file),
        },
    ],
}) {
    const fileInputRef = useRef(null);
    const activeOptionRef = useRef(null);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") onClose?.();
        },
        [onClose],
    );

    useEffect(() => {
        if (!open) return;
        document.addEventListener("keydown", handleKeyDown);
        // Prevent background scroll while the sheet is open
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [open, handleKeyDown]);

    const handleOptionClick = (opt) => {
        opt.onClick?.();
        onClose?.();

        if (opt.type === "file") {
            activeOptionRef.current = opt;
            const input = fileInputRef.current;
            if (input) {
                input.accept = opt.accept || "*/*";
                if (opt.capture) {
                    input.setAttribute("capture", opt.capture);
                } else {
                    input.removeAttribute("capture");
                }
                // Let the sheet-close render happen first, then open the native picker
                setTimeout(() => input.click(), 0);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            activeOptionRef.current?.onFileSelect?.(file);
        }
        // reset so picking the same file again still fires onChange
        e.target.value = "";
        activeOptionRef.current = null;
    };

    return (
        <div
            aria-hidden={!open}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                pointerEvents: open ? "auto" : "none",
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(20, 18, 14, 0.45)",
                    opacity: open ? 1 : 0,
                    transition: "opacity 220ms ease",
                }}
            />

            {/* Sheet */}
            <div
                role="dialog"
                aria-modal="true"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 402,
                    background: "#FFFEFA",
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    padding: "12px 24px 32px",
                    boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
                    transform: open ? "translateY(0)" : "translateY(100%)",
                    transition:
                        "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                {/* Drag handle */}
                <div
                    style={{
                        width: 122,
                        height: 7,
                        borderRadius: 3.5,
                        background: "#2E2E2E",
                        margin: "12px auto 25px",
                    }}
                />

                {/* Options */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {options.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => handleOptionClick(opt)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                width: "100%",
                                height: 60,
                                padding: "0 16px",
                                background: "#F6F1ED",
                                borderRadius: 6,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#383131",
                                fontFamily: "inherit",
                                textAlign: "left",
                            }}
                            onMouseDown={(e) =>
                                (e.currentTarget.style.opacity = 0.8)
                            }
                            onMouseUp={(e) =>
                                (e.currentTarget.style.opacity = 1)
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = 1)
                            }
                        >
                            {opt.icon}
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Hidden input that opens the device's native file/camera picker */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </div>
    );
}
