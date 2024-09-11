# **Invoice Generation Program Documentation**

## **Overview**
This program generates invoices for e-commerce orders using React. It allows users to input order details, computes the total with tax breakdowns, and generates a downloadable PDF of the invoice. The program also converts the total amount into words and includes a placeholder for the seller's signature.

## **Features**
- Inputs for seller, buyer, and item details.
- Computation of net amount, tax amount, and total.
- Generates a downloadable PDF invoice using `jsPDF` and `html2canvas`.
- Converts total amounts to words using `number-to-words`.

## **Input Parameters**
### 1. **Seller Details**:
   - Name
   - Address (City, State, Pincode)
   - PAN No.
   - GST Registration No.

### 2. **Billing Details**:
   - Name
   - Address (City, State, Pincode)
   - State/UT Code

### 3. **Shipping Details**:
   - Name
   - Address (City, State, Pincode)
   - State/UT Code

### 4. **Order Details**:
   - Order No.
   - Order Date

### 5. **Invoice Details**:
   - Invoice No.
   - Invoice Date
   - Reverse Charge (Yes/No)

### 6. **Item Details** (List of items):
   - Description
   - Unit Price
   - Quantity
   - Discount (optional)
   - Tax Rate (e.g., 18%)

### 7. **Signature**:
   - Placeholder for a signature image

## **Computed Parameters**
- **Net Amount**: `(Unit Price * Quantity) - Discount`
- **Tax Amount**: Based on the net amount and tax type.
- **Total Amount**: Sum of net amount and tax amount.
- **Total in Words**: Converts total into words using `number-to-words`.

## **Program Structure**

### 1. **React Components**:
   - A form allows users to input details for the seller, buyer, and items.
   - Data entered into the form is managed using React’s state.

### 2. **Invoice Calculation**:
   - The net amount is computed based on the provided unit price, quantity, and any discounts.
   - Tax is calculated as a percentage of the net amount.
   - The total is displayed on the invoice and converted into words using `number-to-words`.

### 3. **Generating PDF with jsPDF and html2canvas**:
   - The HTML layout of the invoice is captured using `html2canvas`, which creates a canvas snapshot of the invoice.
   - `jsPDF` is then used to convert the canvas into a PDF and provide a download link to the user.
   - The PDF includes the company logo, the seller's signature placeholder, and the itemized order details.

### 4. **Signature Handling**:
   - A placeholder is included for the seller’s signature. You can upload an image file that is inserted into the generated PDF.

### 5. **Amount in Words**:
   - The `number-to-words` package is used to convert the total amount into words, which is displayed at the bottom of the invoice.

## **Technology Stack**
- **Frontend**: React (for managing form inputs and rendering invoice)
- **Libraries**:
   - `jsPDF`: For generating PDFs from HTML content.
   - `html2canvas`: For converting HTML elements to canvas for use in the PDF.
   - `number-to-words`: For converting numeric values into words for the invoice total.

## **Usage Instructions**

### 1. **Setting up the Project**:
   - Install the necessary libraries:
     ```bash
     npm install jspdf html2canvas number-to-words
     ```

### 2. **Using the Program**:
   - Fill in the form with seller details, billing and shipping details, and itemized order information.
   - Click the "Generate Invoice" button, which triggers the PDF generation process.
   - The program calculates the net amount, tax, and total, then generates a PDF that mirrors the layout of the invoice template.

### 3. **Generating the PDF**:
   - The invoice is rendered on the screen using React.
   - When the "Generate Invoice" button is clicked, the invoice is converted to a PDF using `html2canvas` and `jsPDF`.
   - The generated PDF can be downloaded directly by the user.


