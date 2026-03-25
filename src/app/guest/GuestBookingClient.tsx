"use client";

import { useState, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1: The Basics
  fullName: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  linkedIn: string;
  twitter: string;
  website: string;
  bio: string;

  // Step 2: Your Story
  topicPitch: string;
  revelationMoment: string;
  frameworkOrInsight: string;
  audienceTakeaway: string;
  priorPodcasts: string;

  // Step 3: Media Kit
  // File uploads handled separately
  brandColors: string;
  specialRequests: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  title: "",
  company: "",
  email: "",
  phone: "",
  linkedIn: "",
  twitter: "",
  website: "",
  bio: "",
  topicPitch: "",
  revelationMoment: "",
  frameworkOrInsight: "",
  audienceTakeaway: "",
  priorPodcasts: "",
  brandColors: "",
  specialRequests: "",
};

const BLAB_BOOKING_URL = process.env.NEXT_PUBLIC_BLAB_BOOKING_URL || "";

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${isActive ? "bg-gold text-navy-dark scale-110" : ""}
                ${isComplete ? "bg-gold/30 text-gold border border-gold/50" : ""}
                ${!isActive && !isComplete ? "bg-navy-light/40 text-gray-500 border border-navy-light/30" : ""}
              `}
            >
              {isComplete ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            <span
              className={`text-xs font-medium uppercase tracking-wider hidden sm:inline ${
                isActive ? "text-gold" : isComplete ? "text-gold/60" : "text-gray-500"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px mx-1 ${
                  isComplete ? "bg-gold/40" : "bg-navy-light/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input Components ────────────────────────────────────────────────────────
function TextInput({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-navy-dark/60 border border-navy-light/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  hint,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      {hint && (
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{hint}</p>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-navy-dark/60 border border-navy-light/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
      />
    </div>
  );
}

// ─── File Upload ─────────────────────────────────────────────────────────────
function FileUpload({
  label,
  hint,
  accept,
  multiple,
  files,
  onFiles,
}: {
  label: string;
  hint?: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    onFiles(files.filter((_, i) => i !== index));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{hint}</p>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-navy-light/40 rounded-lg p-6 text-center cursor-pointer hover:border-gold/30 transition-colors group"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <div className="text-gray-500 group-hover:text-gray-400 transition-colors">
          <svg
            className="w-8 h-8 mx-auto mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm">Click to upload or drag files here</p>
          <p className="text-xs mt-1 opacity-60">{accept.replace(/\./g, "").toUpperCase()}</p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between bg-navy-dark/40 border border-navy-light/20 rounded-lg px-3 py-2"
            >
              <span className="text-sm text-gray-300 truncate mr-3">
                {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-gray-500 hover:text-red-400 transition-colors text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function GuestBookingClient() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = booking, 1-3 = form steps, 4 = complete
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [headshot, setHeadshot] = useState<File[]>([]);
  const [logo, setLogo] = useState<File[]>([]);
  const [promoImage, setPromoImage] = useState<File[]>([]);
  const [mediaKit, setMediaKit] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const STEPS = ["Your Info", "Your Story", "Media Kit"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        formData.fullName &&
        formData.title &&
        formData.company &&
        formData.email &&
        formData.bio
      );
    }
    if (step === 2) {
      return !!(formData.topicPitch && formData.revelationMoment);
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const submission = new FormData();

      // Text fields
      Object.entries(formData).forEach(([key, value]) => {
        submission.append(key, value);
      });

      // Files
      headshot.forEach((f) => submission.append("headshot", f));
      logo.forEach((f) => submission.append("logo", f));
      promoImage.forEach((f) => submission.append("promoImage", f));
      mediaKit.forEach((f) => submission.append("mediaKit", f));

      const res = await fetch("/api/guest-submit", {
        method: "POST",
        body: submission,
      });

      if (!res.ok) throw new Error("Submission failed");

      setCurrentStep(4);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or email vernon@vernonross.com directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 0: Book a Date ──
  if (currentStep === 0) {
    return (
      <div>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="gold-divider mx-auto mb-6" />
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Book Your <span className="text-gold">Guest Spot</span>
          </h2>
          <p className="text-gray-300 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Pick a recording date that works for you. Once you confirm,
            I&apos;ll walk you through a quick prep process so we both
            show up ready to have a great conversation.
          </p>
        </div>

        {/* BLAB Embed */}
        <div className="bg-navy/50 border border-navy-light/20 rounded-2xl overflow-hidden">
          {BLAB_BOOKING_URL ? (
            <iframe
              src={BLAB_BOOKING_URL}
              title="Book a recording date — Stories That Lead"
              className="w-full border-0"
              style={{ minHeight: "700px" }}
              loading="lazy"
            />
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">
                Scheduling calendar loading...
              </p>
              <a
                href="https://booklikeaboss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors underline"
              >
                Book directly on our scheduling page
              </a>
            </div>
          )}
        </div>

        {/* CTA to continue to prep */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Already booked or prefer to fill out the prep form first?
          </p>
          <button
            onClick={() => setCurrentStep(1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/30 text-gold font-semibold rounded-lg hover:bg-gold/20 transition-colors"
          >
            Continue to Guest Prep
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ── Step 4: Confirmation ──
  if (currentStep === 4) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          You&apos;re All <span className="text-gold">Set</span>
        </h2>
        <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
          I&apos;ve got everything I need to prepare for our conversation.
          You&apos;ll receive a confirmation email with next steps, including
          a brief on the format and what to expect on recording day.
        </p>
        <p className="text-gray-400 text-sm mt-6">
          Questions before then? Reach me at{" "}
          <a
            href="mailto:vernon@vernonross.com"
            className="text-gold hover:text-gold-light transition-colors"
          >
            vernon@vernonross.com
          </a>
        </p>
        <div className="mt-8">
          <span className="text-gold font-bold">&mdash; Vernon</span>
        </div>
      </div>
    );
  }

  // ── Steps 1–3: Onboarding Form ──
  return (
    <div>
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step 1: The Basics */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="mb-8">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Tell Me About <span className="text-gold">You</span>
            </h3>
            <p className="text-gray-400 text-sm">
              The basics so I can introduce you properly and create your
              episode artwork.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Jane Doe"
            />
            <TextInput
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="VP of Communications"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              label="Company / Organization"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              placeholder="Acme Corp"
            />
            <TextInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              type="email"
              placeholder="jane@acme.com"
            />
          </div>

          <TextInput
            label="Phone (for day-of coordination)"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 555-000-0000"
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <TextInput
              label="LinkedIn URL"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              placeholder="linkedin.com/in/janedoe"
            />
            <TextInput
              label="X / Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="@janedoe"
            />
            <TextInput
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="janedoe.com"
            />
          </div>

          <TextArea
            label="Short Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            required
            placeholder="A few sentences about your background and expertise..."
            hint="2-4 sentences. This will be used in episode descriptions and promotional materials."
            rows={4}
          />
        </div>
      )}

      {/* Step 2: Your Story */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="mb-8">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Your <span className="text-gold">Story</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stories That Lead is built on revelation, not conflict. These
              questions help me find the thread of your story before we record.
              Think about the moment that shifted how you lead, communicate, or
              think about your work.
            </p>
          </div>

          <TextArea
            label="What do you want to talk about?"
            name="topicPitch"
            value={formData.topicPitch}
            onChange={handleInputChange}
            required
            placeholder="The topic, framework, or insight you'd bring to the conversation..."
            hint="One to three sentences. What's the core idea you'd want listeners to walk away with?"
            rows={4}
          />

          <TextArea
            label="What was the moment of revelation?"
            name="revelationMoment"
            value={formData.revelationMoment}
            onChange={handleInputChange}
            required
            placeholder="The turning point, the shift, the insight that changed how you approached your work..."
            hint="Every leader has a moment where the old approach stopped working and something new clicked. That's the story I want to tell. Not the drama — the clarity."
            rows={5}
          />

          <TextArea
            label="Is there a framework, methodology, or system behind your approach?"
            name="frameworkOrInsight"
            value={formData.frameworkOrInsight}
            onChange={handleInputChange}
            placeholder="A repeatable process, mental model, or structured approach..."
            hint="If you've built a system others can learn from, I want to unpack it. If not, that's fine — we'll find the pattern together."
            rows={4}
          />

          <TextArea
            label="What should the audience be able to do after listening?"
            name="audienceTakeaway"
            value={formData.audienceTakeaway}
            onChange={handleInputChange}
            placeholder="Apply a framework, rethink an assumption, try a specific approach..."
            hint="Our listeners are communications leaders and executives. What's actionable for them?"
            rows={3}
          />

          <TextArea
            label="Previous podcast or speaking experience"
            name="priorPodcasts"
            value={formData.priorPodcasts}
            onChange={handleInputChange}
            placeholder="Links to past episodes, talks, or panels (optional)..."
            hint="Not a requirement — just helps me tailor the conversation format."
            rows={2}
          />
        </div>
      )}

      {/* Step 3: Media Kit */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="mb-8">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Media <span className="text-gold">Kit</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              I use these assets to build your episode artwork, promotional
              graphics, and social content. The better the inputs, the better
              you&apos;ll look when the episode drops.
            </p>
          </div>

          <FileUpload
            label="Professional Headshot"
            hint="High resolution preferred (minimum 800×800px). PNG or JPG."
            accept=".png,.jpg,.jpeg,.webp"
            files={headshot}
            onFiles={setHeadshot}
          />

          <FileUpload
            label="Company / Personal Logo"
            hint="Vector formats preferred (SVG, PNG with transparency). Used on episode artwork."
            accept=".svg,.png,.jpg,.jpeg,.ai,.eps"
            multiple
            files={logo}
            onFiles={setLogo}
          />

          <FileUpload
            label="Preferred Promo Image"
            hint="A speaking photo, event shot, or lifestyle image you'd like used in promotional materials. Optional."
            accept=".png,.jpg,.jpeg,.webp"
            files={promoImage}
            onFiles={setPromoImage}
          />

          <FileUpload
            label="Media Kit / One-Sheet (if you have one)"
            hint="PDF preferred. Not required — but if you have one, it helps."
            accept=".pdf,.doc,.docx"
            files={mediaKit}
            onFiles={setMediaKit}
          />

          <TextInput
            label="Brand Colors (hex codes)"
            name="brandColors"
            value={formData.brandColors}
            onChange={handleInputChange}
            placeholder="#1e2b46, #cba34c, #ffffff"
          />

          <TextArea
            label="Anything else I should know?"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            placeholder="Pronunciation notes, topics to avoid, scheduling constraints, etc."
            rows={3}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-navy-light/20">
        <button
          onClick={() => setCurrentStep((s) => Math.max(s === 1 ? 0 : s - 1, 0))}
          className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          Back
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => {
              if (validateStep(currentStep)) {
                setCurrentStep((s) => s + 1);
              }
            }}
            disabled={!validateStep(currentStep)}
            className="px-6 py-3 bg-[#ce3c06] hover:bg-[#a52f05] text-white font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#ce3c06] hover:bg-[#a52f05] text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Guest Application"}
          </button>
        )}
      </div>

      {submitError && (
        <p className="text-red-400 text-sm text-center mt-4">{submitError}</p>
      )}
    </div>
  );
}
