import React from "react";
import "./pageB.css";

function Header() {
  return (
    <header>
      <h1>E-Invoice & Material Tracking Portal</h1>
      <nav>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#invoices">Invoices</a></li>
          <li><a href="#tracking">Tracking</a></li>
          <li><a href="#reports">Reports</a></li>
          <li><a href="#gst">GST Details</a></li>
          <li><a href="#payments">Payments</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Table({ headings, rows }) {
  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td key={index}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function PageB() {
  return (
    <div className="PageB">
      <Header />

      <main>
        <Section id="dashboard" title="Dashboard">
          <p>Welcome to the portal. Monitor your invoices, track material loading and unloading, and manage your GST compliance here.</p>
        </Section>

        <Section id="invoices" title="E-Invoices">
          <Button text="Create New Invoice" onClick={() => console.log("Create new invoice")} />
          <Table
            headings={[
              "Invoice Number",
              "Client Name",
              "Date",
              "Status",
              "GST Amount",
              "Total Amount",
              "Payment Status",
              "Actions"
            ]}
            rows={[
              [
                "INV-001",
                "Client A",
                "2024-08-21",
                "Pending",
                "₹ 18,000",
                "₹ 1,18,000",
                "Not Paid",
                <div>
                  <Button text="View" onClick={() => console.log("View invoice")} />
                  <Button text="Edit" onClick={() => console.log("Edit invoice")} />
                  <Button text="Download PDF" onClick={() => console.log("Download PDF")} />
                </div>
              ]
            ]}
          />
        </Section>

        <Section id="tracking" title="Material Tracking">
          <Table
            headings={[
              "Material ID",
              "Description",
              "Loading Status",
              "Unloading Status",
              "Current Location",
              "Estimated Delivery",
              "Actions"
            ]}
            rows={[
              [
                "MAT-001",
                "Steel Rods",
                "Loaded",
                "Not Unloaded",
                "Mumbai",
                "2024-08-25",
                <Button text="Track" onClick={() => console.log("Track material")} />
              ]
            ]}
          />
        </Section>

        <Section id="reports" title="Reports">
          <p>Generate and view detailed reports of all transactions and material tracking.</p>
          <Button text="Generate Report" onClick={() => console.log("Generate report")} />
          <Button text="Download GST Report" onClick={() => console.log("Download GST report")} />
        </Section>

        <Section id="gst" title="GST Details">
          <Table
            headings={[
              "GSTIN",
              "Client Name",
              "Invoice Number",
              "GST Amount",
              "Actions"
            ]}
            rows={[
              [
                "29ABCDE1234F2Z5",
                "Client A",
                "INV-001",
                "₹ 18,000",
                <div>
                  <Button text="View" onClick={() => console.log("View GST details")} />
                  <Button text="Edit" onClick={() => console.log("Edit GST details")} />
                </div>
              ]
            ]}
          />
        </Section>

        <Section id="payments" title="Payments">
          <Table
            headings={[
              "Invoice Number",
              "Client Name",
              "Total Amount",
              "Payment Status",
              "Payment Mode",
              "Actions"
            ]}
            rows={[
              [
                "INV-001",
                "Client A",
                "₹ 1,18,000",
                "Not Paid",
                "Bank Transfer",
                <div>
                  <Button text="Mark as Paid" onClick={() => console.log("Mark as paid")} />
                  <Button text="Send Reminder" onClick={() => console.log("Send reminder")} />
                </div>
              ]
            ]}
          />
        </Section>
      </main>

      <footer>
        <p>&copy; 2024 E-Invoice & Material Tracking Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PageB;
