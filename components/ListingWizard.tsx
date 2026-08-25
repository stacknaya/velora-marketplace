"use client";

import { useMemo, useState } from "react";
import UploadField from "@/components/UploadField";
import { createListing } from "@/app/actions/listings";

type FormState = {
  category: string;
  title: string;
  city: string;
  state: string;
  description: string;
  year: string;
  make: string;
  model: string;
  capacity: string;
  price: string;
  deposit: string;
  instantBook: boolean;
  delivery: boolean;
  uploadedImage: string;
  minDays: string;
  advanceNotice: string;
  partyRideType: string;
  driverIncluded: boolean;
  minimumHours: string;
  overtimeRate: string;
};

const initial: FormState = {
  category: "",
  title: "",
  city: "",
  state: "",
  description: "",
  year: "",
  make: "",
  model: "",
  capacity: "",
  price: "",
  deposit: "",
  instantBook: false,
  delivery: false,
  uploadedImage: "",
  minDays: "1",
  advanceNotice: "24",
  partyRideType: "",
  driverIncluded: true,
  minimumHours: "3",
  overtimeRate: ""
};

const steps = ["Asset", "Details", "Photos", "Pricing", "Availability", "Review"];

export default function ListingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);

  const isPartyRide = form.category === "PARTY_RIDE";
  const priceUnit = isPartyRide ? "hour" : "day";

  const categoryLabel = useMemo(() => {
    const map: Record<string, string> = {
      CAR: "Exotic Car",
      BOAT: "Boat",
      YACHT: "Yacht",
      RV: "RV",
      AIRCRAFT: "Aircraft",
      PARTY_RIDE: "Party Ride"
    };
    return map[form.category] || "Asset";
  }, [form.category]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form action={createListing} className="rounded-[2rem] border border-black/10 bg-white p-6 md:p-8">
      {Object.entries(form).map(([key, value]) => {
        if (typeof value === "boolean") return null;
        return <input key={key} type="hidden" name={key} value={String(value)} />;
      })}
      <input type="hidden" name="priceUnit" value={priceUnit} />
      {form.instantBook && <input type="hidden" name="instantBook" value="on" />}
      {form.delivery && <input type="hidden" name="delivery" value="on" />}
      {form.driverIncluded && <input type="hidden" name="driverIncluded" value="on" />}

      <div className="flex flex-wrap gap-2">
        {steps.map((name, index) => (
          <span
            key={name}
            className={`rounded-full px-3 py-2 text-xs font-bold ${
              index === step ? "bg-black text-white" : index < step ? "bg-black/10" : "bg-neutral-100 text-black/45"
            }`}
          >
            {index + 1}. {name}
          </span>
        ))}
      </div>

      <div className="mt-8">
        {step === 0 && (
          <div>
            <h2 className="text-3xl font-black">What are you listing?</h2>
            <p className="mt-2 text-black/60">Choose an asset category.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["CAR", "Exotic Car"],
                ["BOAT", "Boat"],
                ["YACHT", "Yacht"],
                ["RV", "RV"],
                ["AIRCRAFT", "Aircraft"],
                ["PARTY_RIDE", "Party Ride"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("category", value)}
                  className={`rounded-2xl border p-5 text-left font-bold ${
                    form.category === value ? "border-black bg-black text-white" : "border-black/10 hover:border-black/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-3xl font-black">{categoryLabel} details</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {isPartyRide && (
                <select
                  value={form.partyRideType}
                  onChange={(e) => update("partyRideType", e.target.value)}
                  className="rounded-2xl border border-black/15 p-4 md:col-span-2"
                >
                  <option value="">Choose party ride type</option>
                  <option value="LIMOUSINE">Limousine</option>
                  <option value="PARTY_BUS">Party Bus</option>
                  <option value="SPRINTER_VIP_VAN">Sprinter / VIP Van</option>
                  <option value="STRETCH_SUV">Stretch SUV</option>
                  <option value="CHAUFFEUR_LUXURY">Chauffeur / Luxury Vehicle</option>
                </select>
              )}

              <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Listing title" className="rounded-2xl border border-black/15 p-4 md:col-span-2" />
              <input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="Make / manufacturer" className="rounded-2xl border border-black/15 p-4" />
              <input value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="Model" className="rounded-2xl border border-black/15 p-4" />
              <input value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="Year" className="rounded-2xl border border-black/15 p-4" />
              <input
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                placeholder={isPartyRide ? "Passenger capacity" : "Capacity"}
                className="rounded-2xl border border-black/15 p-4"
              />
              <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className="rounded-2xl border border-black/15 p-4" />
              <input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" className="rounded-2xl border border-black/15 p-4" />

              {isPartyRide && (
                <label className="flex items-center gap-3 rounded-2xl border border-black/15 p-4 md:col-span-2">
                  <input checked={form.driverIncluded} onChange={(e) => update("driverIncluded", e.target.checked)} type="checkbox" />
                  <span>
                    <strong>Professional driver included</strong>
                    <br />
                    <span className="text-sm text-black/50">Recommended for limos, party buses and VIP vans.</span>
                  </span>
                </label>
              )}

              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the asset, amenities, rules and experience." rows={6} className="rounded-2xl border border-black/15 p-4 md:col-span-2" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-black">Add a photo</h2>
            <p className="mt-2 mb-6 text-black/60">Upload a real image from your Mac. It will be stored locally for Phase 3 testing.</p>
            <UploadField value={form.uploadedImage} onChange={(url) => update("uploadedImage", url)} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-black">Pricing & booking rules</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-black/15 p-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-black/40">
                  Base price / {priceUnit}
                </span>
                <input value={form.price} onChange={(e) => update("price", e.target.value)} type="number" placeholder={isPartyRide ? "250" : "1295"} className="mt-2 w-full outline-none" />
              </label>

              <label className="rounded-2xl border border-black/15 p-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-black/40">Security deposit</span>
                <input value={form.deposit} onChange={(e) => update("deposit", e.target.value)} type="number" placeholder="500" className="mt-2 w-full outline-none" />
              </label>

              {isPartyRide && (
                <>
                  <label className="rounded-2xl border border-black/15 p-4">
                    <span className="block text-xs font-bold uppercase tracking-widest text-black/40">Minimum hours</span>
                    <input value={form.minimumHours} onChange={(e) => update("minimumHours", e.target.value)} type="number" min="1" className="mt-2 w-full outline-none" />
                  </label>
                  <label className="rounded-2xl border border-black/15 p-4">
                    <span className="block text-xs font-bold uppercase tracking-widest text-black/40">Overtime rate / hour</span>
                    <input value={form.overtimeRate} onChange={(e) => update("overtimeRate", e.target.value)} type="number" placeholder="300" className="mt-2 w-full outline-none" />
                  </label>
                </>
              )}

              <label className="flex items-center gap-3 rounded-2xl border border-black/15 p-4">
                <input checked={form.instantBook} onChange={(e) => update("instantBook", e.target.checked)} type="checkbox" />
                <span><strong>Instant Book</strong><br /><span className="text-sm text-black/50">Allow qualified guests to book immediately.</span></span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-black/15 p-4">
                <input checked={form.delivery} onChange={(e) => update("delivery", e.target.checked)} type="checkbox" />
                <span><strong>{isPartyRide ? "Pickup service available" : "Delivery available"}</strong><br /><span className="text-sm text-black/50">{isPartyRide ? "Offer pickup and drop-off service." : "Offer delivery or repositioning."}</span></span>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-3xl font-black">Availability</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {!isPartyRide && (
                <label className="rounded-2xl border border-black/15 p-4">
                  <span className="block text-xs font-bold uppercase tracking-widest text-black/40">Minimum days</span>
                  <input value={form.minDays} onChange={(e) => update("minDays", e.target.value)} type="number" className="mt-2 w-full outline-none" />
                </label>
              )}
              <label className="rounded-2xl border border-black/15 p-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-black/40">Advance notice (hours)</span>
                <input value={form.advanceNotice} onChange={(e) => update("advanceNotice", e.target.value)} type="number" className="mt-2 w-full outline-none" />
              </label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">Review</p>
            <h2 className="mt-2 text-3xl font-black">{form.title || `Your ${categoryLabel}`}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-neutral-50 p-5"><span className="text-xs font-bold uppercase tracking-widest text-black/40">Category</span><p className="mt-2 font-bold">{categoryLabel}</p></div>
              <div className="rounded-2xl bg-neutral-50 p-5"><span className="text-xs font-bold uppercase tracking-widest text-black/40">Location</span><p className="mt-2 font-bold">{form.city || "—"}, {form.state || "—"}</p></div>
              <div className="rounded-2xl bg-neutral-50 p-5"><span className="text-xs font-bold uppercase tracking-widest text-black/40">Price</span><p className="mt-2 font-bold">${form.price || "0"} / {priceUnit}</p></div>
              <div className="rounded-2xl bg-neutral-50 p-5"><span className="text-xs font-bold uppercase tracking-widest text-black/40">Deposit</span><p className="mt-2 font-bold">${form.deposit || "0"}</p></div>
              {isPartyRide && (
                <>
                  <div className="rounded-2xl bg-neutral-50 p-5"><span className="text-xs font-bold uppercase tracking-widest text-black/40">Ride type</span><p className="mt-2 font-bold">{form.partyRideType.replaceAll("_", " ") || "—"}</p></div>
                  <div className="rounded-2xl bg-neutral-50 p-5"><span className="text-xs font-bold uppercase tracking-widest text-black/40">Minimum booking</span><p className="mt-2 font-bold">{form.minimumHours || "0"} hours</p></div>
                </>
              )}
            </div>
            <button type="submit" className="mt-6 rounded-2xl bg-black px-6 py-4 font-bold text-white">
              Submit for review
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-between border-t border-black/10 pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="rounded-2xl border border-black/15 px-5 py-3 font-bold disabled:opacity-30"
        >
          Back
        </button>
        {step < steps.length - 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
            className="rounded-2xl bg-black px-6 py-3 font-bold text-white"
          >
            Continue
          </button>
        )}
      </div>
    </form>
  );
}
