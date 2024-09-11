import React, { useState, useEffect } from "react";
import InvoiceTemplate from "./InvoiceTemplate";

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    sellerName: "",
    sellerAddress: "",
    sellerCityStatePincode: "",
    sellerPanNo: "",
    sellerGstNo: "",
    placeOfSupply: "",
    billingName: "",
    billingAddress: "",
    billingCityStatePincode: "",
    billingStateUtCode: "",
    shippingName: "",
    shippingAddress: "",
    shippingCityStatePincode: "",
    shippingStateUtCode: "",
    orderNo: "",
    orderDate: "",
    invoiceNo: "",
    invoiceDate: "",
    reverseCharge: "no",
    items: [
      {
        description: "",
        unitPrice: 0,
        quantity: 1,
        discount: 0,
        netAmount: 0,
        taxRate: 18,
      }
    ],
    signature: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errorTxt, setErorrTxt] = useState(null);
  const [netTotalAmount, setNetTotalAmount] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e, index = null) => {
    const { name, value, files } = e.target;

    if (name === "signature") {
      // For handling the file input
      const file = files[0];
      if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
        setFormData({ ...formData, [name]: files[0] });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result); // Set the preview image URL
        };
        reader.readAsDataURL(file); //
        setErorrTxt(null)

      } else {
        setErorrTxt('**Please upload an image file (PNG, JPG, or JPEG)**')
      }

    } else if (index !== null) {
      // For handling items in the items array
      const updatedItems = [...formData.items];

      // Update the specific field of the item
      updatedItems[index] = { ...updatedItems[index], [name]: value };

      // Perform calculation for netAmount if relevant fields are updated
      const { unitPrice, quantity, discount, taxRate } = updatedItems[index];

      const calculatedAmount = calculateNetAmount(unitPrice, quantity, discount, taxRate);
      updatedItems[index].netAmount = calculatedAmount;

      // Update the formData state with the modified items array
      setFormData({ ...formData, items: updatedItems });
    } else {
      // For other fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateNetAmount = (unitPrice, quantity, discount, taxRate) => {
    unitPrice = parseFloat(unitPrice) || 0;
    quantity = parseInt(quantity) || 0;
    discount = parseFloat(discount) || 0;
    taxRate = parseFloat(taxRate) || 0;

    // Calculate subtotal before discount and tax
    let subtotal = unitPrice * quantity;

    // Apply discount
    let discountedAmount = subtotal * (discount / 100);

    // Subtract discount from subtotal
    let amountAfterDiscount = subtotal - discountedAmount;

    // Apply tax
    let taxAmount = amountAfterDiscount * (taxRate / 100);

    // Final net amount
    let netAmount = amountAfterDiscount + taxAmount;

    return netAmount.toFixed(2); // Return rounded value
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          unitPrice: 0,
          quantity: 1,
          discount: 0,
          netAmount: 0,
          taxRate: 18,
        },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData({ ...formData, items });
  };




  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data Submitted", formData);
    setShowPreview(!showPreview);
    // You can send formData to the backend or process it as needed.
  };

  const calculateTotal = () => {
    let totalAmount = formData.items.reduce((total, item) => total + parseFloat(item.netAmount || 0), 0).toFixed(2);
    return totalAmount;
  };


  // Effect to update the total amount when formData changes
  useEffect(() => {
    setNetTotalAmount(calculateTotal());
  }, [formData]);



  return (
    <>
      {
        showPreview ? <div>
          <InvoiceTemplate invoiceData={formData} img={previewImage} netTotalAmount={netTotalAmount} setShowPreview={setShowPreview} showPreview={showPreview} />
        </div> :
          <div className="bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto bg-white p-5 md:p-10 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Generate Invoice</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Seller Details */}
                <fieldset className="border border-gray-300 p-4">
                  <legend className="text-lg font-medium">Seller Details</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700">Seller Name</label>
                      <input
                        type="text"
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm "
                        placeholder="Enter Seller Name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Seller Address</label>
                      <input
                        type="text"
                        name="sellerAddress"
                        value={formData.sellerAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter Seller Address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        City, State, Pincode
                      </label>
                      <input
                        type="text"
                        name="sellerCityStatePincode"
                        value={formData.sellerCityStatePincode}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="City, State, Pincode"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">PAN No.</label>
                      <input
                        type="text"
                        name="sellerPanNo"
                        value={formData.sellerPanNo}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter PAN No."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        GST Registration No.
                      </label>
                      <input
                        type="text"
                        name="sellerGstNo"
                        value={formData.sellerGstNo}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter GST No."
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Place of Supply */}
                <div>
                  <label className="block text-gray-700">Place of Supply</label>
                  <input
                    type="text"
                    name="placeOfSupply"
                    value={formData.placeOfSupply}
                    onChange={handleChange}
                    className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                    placeholder="Enter Place of Supply"
                  />
                </div>

                {/* Billing Details */}
                <fieldset className="border border-gray-300 p-4">
                  <legend className="text-lg font-medium">Billing Details</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700">Billing Name</label>
                      <input
                        type="text"
                        name="billingName"
                        value={formData.billingName}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter Billing Name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Billing Address</label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter Billing Address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        City, State, Pincode
                      </label>
                      <input
                        type="text"
                        name="billingCityStatePincode"
                        value={formData.billingCityStatePincode}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="City, State, Pincode"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">State/UT Code</label>
                      <input
                        type="text"
                        name="billingStateUtCode"
                        value={formData.billingStateUtCode}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter State/UT Code"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Shipping Details */}
                <fieldset className="border border-gray-300 p-4">
                  <legend className="text-lg font-medium">Shipping Details</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700">Shipping Name</label>
                      <input
                        type="text"
                        name="shippingName"
                        value={formData.shippingName}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter Shipping Name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Shipping Address</label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter Shipping Address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">
                        City, State, Pincode
                      </label>
                      <input
                        type="text"
                        name="shippingCityStatePincode"
                        value={formData.shippingCityStatePincode}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="City, State, Pincode"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">State/UT Code</label>
                      <input
                        type="text"
                        name="shippingStateUtCode"
                        value={formData.shippingStateUtCode}
                        onChange={handleChange}
                        className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                        placeholder="Enter State/UT Code"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Order and Invoice Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Order No.</label>
                    <input
                      type="text"
                      name="orderNo"
                      value={formData.orderNo}
                      onChange={handleChange}
                      className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                      placeholder="Enter Order No."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Order Date</label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Invoice No.</label>
                    <input
                      type="text"
                      name="invoiceNo"
                      value={formData.invoiceNo}
                      onChange={handleChange}
                      className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                      placeholder="Enter Invoice No."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Invoice Date</label>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleChange}
                      className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Reverse Charge */}
                <div>
                  <label className="block text-gray-700">Reverse Charge</label>
                  <select
                    name="reverseCharge"
                    value={formData.reverseCharge}
                    onChange={handleChange}
                    className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Item Details */}
                <fieldset className="border border-gray-300 p-4">
                  <legend className="text-lg font-medium">Item Details</legend>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="text-[12px] font-bold text-left p-2 text-gray-700">Description</th>
                          <th className="text-[12px] font-bold text-left p-2 text-gray-700 w-[30px]">Unit Price</th>
                          <th className="text-[12px] font-bold text-left p-2 text-gray-700 w-[40px]">Quantity</th>
                          <th className="text-[12px] font-bold text-left p-2 text-gray-700">Discount</th>
                          <th className="text-[12px] font-bold text-left p-2 text-gray-700">Net Amount</th>
                          <th className="text-[12px] font-bold text-left p-2 text-gray-700">Tax Rate (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => (
                          <tr key={index} className="border-b group relative">
                            <td className="p-2 text-[12px] font-bold">
                              <input
                                type="text"
                                name="description"
                                value={item.description}
                                onChange={(e) => handleChange(e, index)}
                                className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                                placeholder="Item Description"
                              />
                            </td>
                            <td className="p-2 text-[12px] font-bold">
                              <input
                                type="number"
                                name="unitPrice"
                                value={item.unitPrice}
                                onChange={(e) => handleChange(e, index)}
                                className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                                placeholder="Unit Price"
                              />
                            </td>
                            <td className="p-2 text-[12px] font-bold">
                              <input
                                type="number"
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleChange(e, index)}
                                className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                                placeholder="Quantity"
                              />
                            </td>
                            <td className="p-2 text-[12px] font-bold">
                              <input
                                type="number"
                                name="discount"
                                value={item.discount}
                                onChange={(e) => handleChange(e, index)}
                                className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                                placeholder="Discount"
                              />
                            </td>
                            <td className="p-2 text-[12px] font-bold">
                              <input
                                type="number"
                                name="netAmount"
                                value={item.netAmount}
                                onChange={(e) => handleChange(e, index)}
                                className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                                placeholder="Net Amount"
                                readOnly
                              />
                            </td>
                            <td className="p-2 text-[12px] font-bold">
                              <input
                                type="number"
                                name="taxRate"
                                value={item.taxRate}
                                onChange={(e) => handleChange(e, index)}
                                className="mt-1 block w-full outline-none border-gray-300 shadow-sm"
                                placeholder="Tax Rate"
                              />
                            </td>
                            <td className="p-2 text-center absolute right-2 hidden group-hover:block text-[12px] font-bold">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500"
                              >
                                ❌
                              </button>
                            </td>
                          </tr>

                        ))}

                      </tbody>
                    </table>
                    <div className="flex my-2" >
                      <div className="w-[50%] font-bold">Total</div>
                      <div className="w-[50%] text-end mr-5 font-bold" >{calculateTotal()}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="mt-4 px-4 py-2 bg-green-500 text-white outline-none"
                  >
                    Add Item
                  </button>
                </fieldset>


                {/* Signature */}
                <div>
                  <label className="block text-gray-700 cursor-pointer">Signature (Upload)</label>
                  {!previewImage && <div className="flex gap-2" ><label className="block w-[120px] h-[30px] border border-black cursor-pointer my-2" htmlFor="signature" ></label></div>}
                  <input
                    type="file"
                    name="signature"
                    onChange={handleChange}
                    className="w-full hidden"
                    id="signature"
                    accept="image/*"
                  />
                </div>

                {previewImage && (

                  <div className="flex gap-2" >
                    <span>
                      <img src={previewImage} alt="Signature Preview" className="w-[120px] h-[40px] object-fill mt-0" />
                    </span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => { setPreviewImage(null); document.getElementById('signature').value = ''; }}
                    >
                      ❌
                    </button>
                  </div>
                )}
                {
                  errorTxt !== null && <span className="font-bold text-red-600" >{errorTxt}</span>
                }
                <button className="bg-green-400 w-full outline-none py-2 font-bold" onClick={handleSubmit} >Genrate Invoice</button>
              </form>
            </div>
          </div>
      }

    </>
  );
};

export default InvoiceForm;
