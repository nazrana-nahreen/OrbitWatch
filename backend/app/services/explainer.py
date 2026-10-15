from typing import List, Dict
from ..schemas.asteroid import GlossaryTerm

GLOSSARY_ITEMS: List[GlossaryTerm] = [
    GlossaryTerm(
        term="Close Approach",
        label_bn="নিকটবর্তী আগমন (Close Approach)",
        definition="The moment when a celestial body (such as an asteroid) reaches its minimum distance from Earth along its natural trajectory.",
        importance="Allows astronomers to schedule radar, optical tracking, and spectroscopic observations to refine its orbit.",
        misconception="A close approach is NOT an impact or a collision. Asteroids safely pass millions or hundreds of thousands of kilometers away."
    ),
    GlossaryTerm(
        term="Potentially Hazardous Asteroid (PHA)",
        label_bn="সম্ভাব্য ঝুঁকিপূর্ণ গ্রহাণু (PHA)",
        definition="An asteroid with an Earth Minimum Orbit Intersection Distance (MOID) of 0.05 AU (approx. 7.48 million km or 19.5 Lunar Distances) or less, and an absolute magnitude H of 22.0 or brighter (indicating a diameter of roughly 140+ meters).",
        importance="Used by NASA/JPL to prioritize long-term orbital tracking and observation over centuries.",
        misconception="Calling an asteroid 'Potentially Hazardous' does NOT mean it will hit Earth. It simply means its orbit comes relatively close to Earth's orbit and it is large enough to warrant careful monitoring."
    ),
    GlossaryTerm(
        term="Semi-major Axis (a)",
        label_bn="অর্ধ-মূখ্য অক্ষ (Semi-major Axis, a)",
        definition="Half of the longest diameter of an elliptical orbit, measured in Astronomical Units (AU). It represents the asteroid's average distance from the Sun.",
        importance="Determines the orbital period (how long it takes to complete one orbit around the Sun via Kepler's Third Law).",
        misconception="Earth's average distance is 1.0 AU (~149.6 million km)."
    ),
    GlossaryTerm(
        term="Eccentricity (e)",
        label_bn="উৎকেন্দ্রিকতা (Eccentricity, e)",
        definition="A dimensionless parameter between 0 and 1 describing the elongation of the orbit. A circle has e = 0, while elongated ellipses have e close to 1.",
        importance="High eccentricity means the asteroid swings very close to the Sun at perihelion and travels far out at aphelion, often crossing the orbits of inner planets.",
        misconception="Planets usually have almost circular orbits (Earth's e is ~0.0167), whereas many asteroids have elongated orbits (e > 0.2)."
    ),
    GlossaryTerm(
        term="Inclination (i)",
        label_bn="নতি বা হেলানো কোণ (Inclination, i)",
        definition="The angle of tilt between the asteroid's orbital plane and Earth's orbital plane (the ecliptic), measured in degrees.",
        importance="Even if an asteroid's 2D orbit seems to cross Earth's path, a high inclination means it actually passes far above or below Earth in 3D space.",
        misconception="A 2D orbit map can give a false impression of collision; in reality, orbits exist in 3D space with vertical separation."
    ),
    GlossaryTerm(
        term="MOID (Minimum Orbit Intersection Distance)",
        label_bn="ন্যূনতম কক্ষপথ সংযোগ দূরত্ব (Earth MOID)",
        definition="The closest possible geometrical distance between the orbits of two bodies (e.g. an asteroid and Earth), ignoring their current positions.",
        importance="If Earth MOID > 0.05 AU (~7.5 million km), a collision is geometrically impossible in the current orbit configuration.",
        misconception="MOID is the distance between the orbits, not between the actual bodies right now."
    ),
    GlossaryTerm(
        term="Condition Code (U)",
        label_bn="অরবিট অনিশ্চয়তা কোড (Condition Code, U)",
        definition="A rating from 0 (very well known orbit) to 9 (highly uncertain) quantifying the uncertainty in the asteroid's orbital solution.",
        importance="Objects with short observation arcs have higher U values. Over time with more telescopes observing, U drops to 0.",
        misconception="High uncertainty does not mean high danger; it only means fewer observation nights have been recorded yet."
    ),
    GlossaryTerm(
        term="Lunar Distance (LD)",
        label_bn="চাঁদের দূরত্ব (Lunar Distance, LD)",
        definition="The average distance between the center of Earth and the center of the Moon, approximately 384,400 km (0.00257 AU).",
        importance="Used as an intuitive unit for measuring close approaches. For instance, 5 LD means 5 times farther than the Moon.",
        misconception="The Moon is quite far (~384,400 km). Most close-approach asteroids pass at several LDs safely away."
    )
]

def get_glossary() -> List[GlossaryTerm]:
    return GLOSSARY_ITEMS

def get_disclaimer() -> Dict[str, str]:
    return {
        "title": "Educational & Scientific Notice",
        "title_bn": "শিক্ষামূলক ও বৈজ্ঞানিক তথ্য বিজ্ঞপ্তি",
        "text": "OrbitWatch AI is an educational scientific explorer built with public NASA/JPL Small-Body data. It is NOT an official impact-monitoring or emergency-warning service. We do not generate unverified impact probabilities or alarming risk ratings. For official planetary defense assessments, visit NASA's Center for Near-Earth Object Studies (cneos.jpl.nasa.gov).",
        "text_bn": "OrbitWatch AI হলো NASA/JPL-এর উন্মুক্ত মহাকাশ গবেষণা ডেটা ব্যবহার করে তৈরি একটি শিক্ষামূলক বিজ্ঞান অনুসন্ধান প্ল্যাটফর্ম। এটি কোনো সরকারি সতর্কতা বা আঘাত পর্যবেক্ষণ সার্ভিস নয়। আমরা কোনো কাল্পনিক ঝুঁকি রেটিং প্রচার করি না। অফিসিয়াল তথ্যের জন্য NASA CNEOS (cneos.jpl.nasa.gov) দেখুন।"
    }
