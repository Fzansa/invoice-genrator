import React, { useRef } from 'react';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { toWords } from 'number-to-words';



const InvoiceTemplate = ({ invoiceData, img, netTotalAmount, setShowPreview, showPreview }) => {
  const invoiceRef = useRef(null);

  const {
    sellerName,
    sellerAddress,
    sellerCityStatePincode,
    sellerPanNo,
    sellerGstNo,
    placeOfSupply,
    billingName,
    billingAddress,
    billingCityStatePincode,
    billingStateUtCode,
    shippingName,
    shippingAddress,
    shippingCityStatePincode,
    shippingStateUtCode,
    orderNo,
    orderDate,
    invoiceNo,
    invoiceDate,
    reverseCharge,
    items,
    totalAmount,
    amountInWords,
  } = invoiceData;


  // Function to generate and download PDF using jsPDF
  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('invoice.pdf');
    });
  };

  return (
    <div className='max-w-3xl mx-auto relative' >
      <h1 className=' ml-5 my-5 text-gray-600-500 font-semibold cursor-pointer' onClick={() => setShowPreview(!showPreview)}><i className="fa-solid fa-arrow-left me-2"></i>Back</h1>
      <div className=" p-8 bg-white shadow-md mt-4" ref={invoiceRef} >
        {/* Header with logo and title */}
        <div className="flex justify-between mb-8">
          <div>
            <img src="amazon-in.svg" alt="Logo" className="h-8 md:h-12" />
          </div>
          <div className='text-right' >
            <h1 className="text-[12px] md:text-xl font-bold">Tax Invoice/Bill of Supply/Cash Memo</h1>
            <p className='text-[10px] md:text-[15px]'>(Original for Recipient)</p>
          </div>
        </div>

        {/* Seller and Billing Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className='text-[12px] md:text-[15px]' >
            <h2 className="font-bold">Sold By:</h2>
            <p>{sellerName}</p>
            <p>{sellerAddress}</p>
            <p>{sellerCityStatePincode}</p>
            <p className='mt-8' ><strong>PAN No:</strong> {sellerPanNo}</p>
            <p><strong>GST Registration No:</strong> {sellerGstNo}</p>
          </div>
          <div className='text-right text-[12px] md:text-[15px]' >
            <h2 className="font-bold">Billing Address:</h2>
            <p>{billingName}</p>
            <p>{billingCityStatePincode}</p>
            <p>State/UT Code: {billingStateUtCode}</p>

            <h2 className="font-bold mt-8">Shipping Address:</h2>
            <p>{shippingName}</p>
            <p>{shippingAddress}</p>
            <p>{shippingCityStatePincode}</p>
            <p><strong>State/UT Code:</strong> {shippingStateUtCode}</p>
            <p><strong>Place Of Supply:</strong> {placeOfSupply}</p>
            {/* <p><strong>Place Of Delivery:</strong> {placeOfSupply}</p> */}

          </div>
        </div>

        {/* Order and Invoice Information */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-[12px] md:text-[15px]">
          <div>
            <p><strong>Order Number:</strong> {orderNo}</p>
            <p><strong>Order Date:</strong> {orderDate}</p>
          </div>
          <div>
            <p><strong>Invoice Number:</strong> {invoiceNo}</p>
            <p><strong>Invoice Date:</strong> {invoiceDate}</p>
          </div>
        </div>

        {/* Item Table */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 border">
              <th className="text-[12px] font-bold border p-2 text-left">Sl No.</th>
              <th className="text-[12px] font-bold border p-2 text-left">Description</th>
              <th className="text-[12px] font-bold border p-2 text-left">Unit Price</th>
              <th className="text-[12px] font-bold border p-2 text-left">Quantity</th>
              <th className="text-[12px] font-bold border p-2 text-left">Tax</th>
              <th className="text-[12px] font-bold border p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border">
                <td className="text-[12px] font-bold border p-2">{index + 1}</td>
                <td className="text-[12px] font-bold border p-2">{item.description}</td>
                <td className="text-[12px] font-bold border p-2">{item.unitPrice}</td>
                <td className="text-[12px] font-bold border p-2">{item.quantity}</td>
                <td className="text-[12px] font-bold border p-2">{item.taxRate}</td>
                <td className="text-[12px] font-bold border p-2">{item.netAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total and Amount in Words */}
        <div className="mb-4 w-full">
          <div className='flex justify-between items-center font-bold border p-2 text-[12px]' >
            <div>Total Amount:</div>
            <div>₹{netTotalAmount}</div>
          </div>
          <div className='border border-t-0 flex justify-between items-center text-[12px] font-bold p-2' >
            <div>Amount in Words:</div>
            <div>{toWords(Math.floor(netTotalAmount))} rupees and {toWords(Math.round((netTotalAmount % 1) * 100))} paise</div>
          </div>
          <p className='text-[12px] md:text-[15px] font-bold' >Wheather Tax is payable under the reverse charge - {reverseCharge}</p>
        </div>

        {/* Authorized Signatory */}
        <div className="text-right">
          <p>For {sellerName}</p>
          <span className='flex justify-end' >
            <img src={img} alt="Signature Preview" className="w-[120px] h-[40px] object-fill mt-0" />
          </span>
          <p>Authorized Signatory</p>
        </div>
      </div>
      <button className="bg-blue-600 w-[60px] h-[60px] rounded-full text-white px-4 py-2 my-3 fixed bottom-3 right-6 md:right-28" onClick={handleDownloadPDF} ><i className="fa-regular fa-floppy-disk text-2xl"></i></button>
    </div>
  );
};

export default InvoiceTemplate;
