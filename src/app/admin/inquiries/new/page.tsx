// src/app/admin/inquiries/new/page.tsx

import InquiryForm from '@/components/InquiryForm'

export default function NewInquiryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#000000]">Nová poptávka</h1>
        <p className="text-gray-600 mt-1">
          Vytvoření záznamu poptávky s automatickým ověřením subjektu přes ARES.
        </p>
      </div>

      <InquiryForm />
    </div>
  )
}