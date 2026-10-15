import React, { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  duration?: number; // Timer duration in seconds (default: 60)
  onResend?: () => void; // Callback when resend is pressed
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  duration = 60,
  onResend,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format seconds into MM:SS (e.g., 00:45)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendPress = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration); // Reset timer
      onResend?.();
    }
  };

  const handleChangeText = (text: string, index: number) => {
    // Handle paste event for full codes
    if (text.length > 1) {
      const sanitizedText = text.replace(/[^0-9]/g, "").slice(0, length);
      onChange(sanitizedText);
      const nextIndex = Math.min(sanitizedText.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = value.split("");
    newOtp[index] = text;
    const updatedOtp = newOtp.join("");
    onChange(updatedOtp);

    // Auto-advance
    if (text !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!value[index] && index > 0) {
        const newOtp = value.split("");
        newOtp[index - 1] = "";
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] || "";
          const isFocused = focusedIndex === index;

          return (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.input,
                digit ? styles.inputFilled : null,
                isFocused ? styles.inputFocused : null,
              ]}
              keyboardType="number-pad"
              maxLength={index === 0 ? length : 1}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              selectTextOnFocus
              textAlign="center"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
          );
        })}
      </View>

      {/* Timer and Resend Section */}
      <View style={styles.footerContainer}>
        {timeLeft > 0 ? (
          <Text style={styles.timerText}>
            Resend code in{" "}
            <Text style={styles.timerBold}>{formatTime(timeLeft)}</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendPress} activeOpacity={0.7}>
            <Text style={styles.resendText}>
              Didn't receive code? <Text style={styles.resendBold}>Resend</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: 20,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: 55,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 50,
    fontSize: 18,
    fontWeight: "500",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  },
  inputFilled: {
    borderColor: "#94A3B8",
    backgroundColor: "#FFFFFF",
  },
  inputFocused: {
    borderColor: "#ecc209ff",
    backgroundColor: "#FFFFFF",
    shadowColor: "#ecc209ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#64748B",
  },
  timerBold: {
    fontWeight: "600",
    color: "#0F172A",
  },
  resendText: {
    fontSize: 14,
    color: "#64748B",
  },
  resendBold: {
    fontWeight: "700",
    color: "#000000ff",
  },
});

export default OTPInput;
