import { useState, useEffect } from 'react';
import { clinic as initialClinic } from '../data/clinic.js';

let cachedClinic = { ...initialClinic };

/**
 * Normalizes API data into the shape expected by frontend components.
 */
function parseClinic(data) {
  if (!data) return initialClinic;

  // Format phones into [{ label, tel, display }]
  const phones = [];
  if (data.phone) {
    phones.push({
      label: data.phone.replace(/\D/g, ''),
      tel: data.phone.replace(/\s+/g, ''),
      display: data.phone,
    });
  }
  if (data.phoneSecondary) {
    phones.push({
      label: data.phoneSecondary.replace(/\D/g, ''),
      tel: data.phoneSecondary.replace(/\s+/g, ''),
      display: data.phoneSecondary,
    });
  }
  if (phones.length === 0) {
    phones.push(...initialClinic.contact.phones);
  }

  // Format address
  let addressLines = initialClinic.contact.addressLines;
  let addressSingle = initialClinic.contact.addressSingle;
  if (data.address && (data.address.line1 || data.address.city)) {
    const lines = [
      data.address.line1,
      data.address.line2,
      [data.address.city, data.address.state, data.address.pincode].filter(Boolean).join(', '),
    ].filter(Boolean);
    if (lines.length > 0) {
      addressLines = lines;
      addressSingle = lines.join(', ');
    }
  }

  return {
    ...initialClinic,
    name: data.name || initialClinic.name,
    tagline: data.tagline || initialClinic.tagline,
    hours: Array.isArray(data.hours) && data.hours.length > 0 ? data.hours : initialClinic.hours,
    socials: data.socials || {},
    meta: {
      ...initialClinic.meta,
      ...(data.metaDefaults || {}),
    },
    contact: {
      ...initialClinic.contact,
      addressLines,
      addressSingle,
      email: data.email || initialClinic.contact.email,
      phones,
      primaryPhone: data.phone || initialClinic.contact.primaryPhone,
      whatsapp: data.whatsapp || initialClinic.contact.whatsapp,
      mapsUrl: data.address?.mapUrl || initialClinic.contact.mapsUrl,
    },
  };
}

/**
 * Async fetch of site details with static data fallback.
 */
export async function fetchClinicDetails() {
  try {
    const res = await fetch('/api/site-details');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        cachedClinic = parseClinic(data);
        return cachedClinic;
      }
    }
  } catch {
    // API unreachable; fall back to static cache
  }
  return cachedClinic;
}

/**
 * Synchronous access to current cached clinic information.
 */
export function getCachedClinic() {
  return cachedClinic;
}

/**
 * Reactive hook for public components to consume dynamic site details.
 * Automatically synchronizes when admin updates site details via CustomEvent.
 */
export function useClinic() {
  const [clinicData, setClinicData] = useState(cachedClinic);

  useEffect(() => {
    let live = true;

    fetchClinicDetails().then((data) => {
      if (live) setClinicData(data);
    });

    const onClinicUpdated = (e) => {
      if (e?.detail) {
        cachedClinic = parseClinic(e.detail);
        if (live) setClinicData(cachedClinic);
      } else {
        fetchClinicDetails().then((data) => {
          if (live) setClinicData(data);
        });
      }
    };

    window.addEventListener('clinic-updated', onClinicUpdated);
    return () => {
      live = false;
      window.removeEventListener('clinic-updated', onClinicUpdated);
    };
  }, []);

  return clinicData;
}
