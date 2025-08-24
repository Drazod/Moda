import React from "react";

const Notification = () => {
  return (
    <section className="col-span-2 bg-[#BFAF92] rounded-2xl p-6 shadow-md z-10"> 
        <h2 className="text-lg font-semibold mb-4">Notification</h2>
        <div className="space-y-6 text-base text-[#1D1A05]"> <div> 
            <p className="font-semibold">New Product</p> 
            <p className="text-sm text-[#696F8C]">| Look at out last release </p>
            <p className="mt-1 text-sm">
                 Winter collection with good design 
                <a href="#" className="text-blue-600">@click here</a>
            </p> 
            <p className="text-[#696F8C] text-xs">8 min ago</p> 
        </div> 
        <hr /> 
        <div> 
            <p className="font-semibold">Your order had arrived</p> 
            <p className="text-sm text-[#696F8C]">| Order #1233 </p>
            <p className="mt-1 text-sm">
                Any question about refund 
                <a href="#" className="text-blue-600">@click here</a>
            </p> 
            <p className="text-[#696F8C] text-xs">12 min ago</p> 
        </div> 
        <hr /> 
        <div> 
            <p className="font-semibold">New Voucher</p> 
            <p className="text-sm text-[#696F8C]">Limited time </p>
            <p>
                <a href="#" className="text-blue-600">@Go shopping now</a>
            </p>
            <p className="text-[#696F8C] text-xs">18 min ago</p> 
        </div> 
    </div> 
</section>
  );
};

export default Notification;
