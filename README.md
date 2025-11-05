# ⚡ DCCA-Web: DC Circuit & System Analyzer

### 🧠 Multidisciplinary Project — Team 489 | VIT Chennai

This project is a **web-based DC Circuit Analyzer** that allows users to define simple resistor circuits, automatically solves for **node voltages and branch currents using Nodal Analysis**, and performs **thermal failure checks** based on component ratings.

Built as a collaborative multidisciplinary project integrating **CSE, EEE, ECE,** and **Mechanical** domains.

---

## 🚀 Features

- Interactive web interface for defining DC circuits  
- Automated **Nodal Analysis Solver** using NumPy  
- Calculates **node voltages** and **branch currents**  
- Simulates a **virtual switch** (open/closed control element)  
- Displays **thermal overload warnings** based on rated power  
- Clean, responsive user interface  

---

## 🧩 Project Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript | User interface for circuit input and result visualization |
| **Backend** | Python (Flask) | API and solver logic |
| **Computation Engine** | NumPy | Solves matrix equations (G·V = I) |
| **Database / Config** | JSON | Stores resistor data and thermal ratings |

---

## 🧮 Core Logic (EEE + CSE)

The backend performs **Nodal Analysis** using the matrix equation:

\[
G \cdot V = I
\]

Where:  
- **G** = Conductance Matrix (from resistors)  
- **V** = Node Voltages (unknowns)  
- **I** = Current Source Vector  

After solving for **V**, branch currents are computed via:

\[
I_{branch} = \frac{V_{start} - V_{end}}{R}
\]

And **thermal power dissipation** for each resistor is:

\[
P = I^2 \cdot R
\]

If `P > Rated Power`, a **failure warning** is displayed.

---

## 🧠 Disciplines Involved

| Discipline | Contribution |
| :--- | :--- |
| **CSE** | Web architecture, data structures (Graph), backend integration |
| **EEE** | Nodal analysis logic, voltage/current computation |
| **ECE** | Control system element (virtual switch) |
| **Mechanical** | Thermal and failure analysis model |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/DCCA-Web.git
cd DCCA-Web
```

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
