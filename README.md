# Smart Bus Ticketing with Face & QR Code

A modern, AI-powered ticketing system for public buses that uses face recognition and QR codes to streamline ticket verification, reduce fraud, and improve passenger experience.

---

## 🚍 Overview

This project enables seamless bus ticketing by combining face recognition and QR code scanning:

- **Boarding:** When a passenger enters the bus, a camera captures their face.
- **QR Scan:** The passenger scans a QR code inside the bus using the mobile app within 5 minutes.
- **Selfie Verification:** The app prompts the user to take a selfie, which is matched with the bus camera image.
- **Ticket/Pass:** If a ticket is purchased or a monthly pass is verified (using face and phone number), the journey continues.
- **Conductor Alert:** If verification fails, the conductor is alerted with the passenger’s photo and their location in the bus.

This system helps reduce missed ticket checks, speeds up boarding, and prevents fraud — all using AI and minimal hardware.

---

## ✨ Features

- **Face Recognition:** Matches passenger selfie with bus camera image for secure verification.
- **QR Code Integration:** Ensures the passenger is physically present in the bus.
- **Multiple Ticket Options:** Buy single journey tickets or validate monthly passes.
- **Conductor Alerts:** Notifies staff if verification fails, with photo and seat location.
- **Privacy First:** Selfies are used only for verification and not shared with third parties.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Python 3](https://www.python.org/) (for CCTV simulation)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/auto-fare.git
   cd auto-fare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **(Optional) Run CCTV Simulation:**
   ```bash
   cd cctv_symulation
   python3 display.py
   ```

---

## 🗂️ Project Structure

```
app/                # Next.js app (pages, components, API routes)
lib/                # Face API setup and MongoDB connection
cctv_symulation/    # Python script for simulating bus camera
```

---

## 🧑‍💻 How It Works

1. **User Authentication:** Passengers verify their phone number via OTP.
2. **Selfie Capture:** The app prompts for a selfie.
3. **Face Verification:** The selfie is matched with the latest bus camera image using AI.
4. **Ticket Selection:** User chooses to buy a ticket or validate a pass.
5. **Payment:** Supports card and UPI payments.
6. **Confirmation:** A digital ticket with QR code is generated.
7. **Conductor Alert:** If verification fails, staff are notified.

---

## 🛡️ Privacy & Security

- All face data is processed securely and used only for verification.
- No selfies or personal data are shared with third parties.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

## 📝 License

MIT License

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For questions or support, please open an issue or contact the