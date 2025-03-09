/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import React from "react";

import { SamplesDatum } from "@/types";

import { Button } from "../ui/button";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "1px solid #000",
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyAddress: {
    fontSize: 10,
    color: "#666",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: "5px 0",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    padding: "5px",
    width: "30%",
  },
  tableCell: {
    padding: "5px",
    width: "70%",
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
});

// Helper function to format dates
const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "MM/dd/yyyy HH:mm");
  } catch {
    return "Invalid Date";
  }
};

// PDF component
const PackingSlipPDF = ({ data }: { data: SamplesDatum }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.companyName}>DNA Learning Center, Nigeria.</Text>
        <Text style={styles.companyAddress}>
          123 Lab Street, Science City, SC 12345 | Phone: (123) 456-7890 |
          Email: info@samplelab.com
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Sample Packing Slip</Text>

      {/* Table for Data */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Test Performed</Text>
          <Text style={styles.tableCell}>{data.test_performed}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Sample Type</Text>
          <Text style={styles.tableCell}>{data.sample_type}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Sample ID</Text>
          <Text style={styles.tableCell}>{data.sampleId}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Collection Date</Text>
          <Text style={styles.tableCell}>
            {formatDate(data.collection_date)}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Collection Time</Text>
          <Text style={styles.tableCell}>{data.collection_time || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Donor Relationship</Text>
          <Text style={styles.tableCell}>
            {data.relationship_donor || "N/A"}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Dropoff Address</Text>
          <Text style={styles.tableCell}>{data.dropoff_address || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Pickup Date</Text>
          <Text style={styles.tableCell}>{formatDate(data.pickup_date)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Pickup Time</Text>
          <Text style={styles.tableCell}>{data.pickup_time || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Status</Text>
          <Text style={styles.tableCell}>{data.status}</Text>
        </View>
      </View>

      {/* Footer Section */}
      <Text style={styles.footer}>
        Thank you for choosing DNA Learning center. Nigeria. Please attach this
        slip to your sample before dispatching.
      </Text>
    </Page>
  </Document>
);

// Button to trigger download
const PackingSlipDownloadTwo = ({ formData }: { formData: SamplesDatum }) => (
  <PDFDownloadLink
    document={<PackingSlipPDF data={formData} />}
    fileName="packing_slip.pdf"
  >
    {({ loading }) => (
      <Button className="rounded bg-primary p-2 text-white">
        {loading ? "Generating PDF..." : "Download Packing Slip"}
      </Button>
    )}
  </PDFDownloadLink>
);

export default PackingSlipDownloadTwo;
