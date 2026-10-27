import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoSlot from "../components/PhotoSlot";

const ITEMS = [
  {
    cat: "WEDDING",
    name: "Romantic Garden Wedding",
    image: "wedding-garden-01.png",
  },
  {
    cat: "WEDDING",
    name: "Classic Ballroom Wedding",
    image: "wedding-table-01.png",
  },
  {
    cat: "WEDDING",
    name: "Wedding Table",
    image: "wedding-table-02.png",
  },
  {
    cat: "WEDDING",
    name: "Wedding Table",
    image: "wedding-table-03.png",
  },
  {
    cat: "WEDDING",
    name: "Wedding Table",
    image: "wedding-table-04.png",
  },
  {
    cat: "WEDDING",
    name: "Wedding Table",
    image: "wedding-table-05.png",
  },
  {
    cat: "WEDDING",
    name: "Wedding Table",
    image: "wedding-table-06.png",
  },
  {
    cat: "WEDDING",
    name: "Wedding Table",
    image: "wedding-table-07.png",
  },

  {
    cat: "OUTDOOR",
    name: "Botanical Garden Wedding",
    image: "garden-wedding-1.png",
  },
  {
    cat: "OUTDOOR",
    name: "Outdoor Garden Party",
    image: "garden-party-1.png",
  },

  {
    cat: "CORPORATE",
    name: "Corporate Gala Dinner",
    image: "corporate-galadinner.png",
  },
  {
    cat: "CORPORATE",
    name: "Company Seminar Dining",
    image: "company-seminar.png",
  },

  {
    cat: "BRAND EVENT",
    name: "Brand Launching Event",
    image: "brand-event.png",
  },

  {
    cat: "PRIVATE",
    name: "Private Birthday Party",
    image: "private-birthday-01.png",
  },
];

const CATS = [
  "ALL",
  "WEDDING",
  "OUTDOOR",
  "CORPORATE",
  "BRAND EVENT",
  "PRIVATE",
];

function Gallery() {
  const [params] = useSearchParams();
  const [active, setActive] = useState(() => CATS.includes(params.get('category')) ? params.get('category') : "ALL");

  const visible =
    active === "ALL" ? ITEMS : ITEMS.filter((item) => item.cat === active);

  return (
    <>
      <Header />

      <section className="gallery-page-hero">
        <div className="wrap">
          <div className="label">GALLERY</div>

          <h1>
            우리가 새긴
            <br />
            기억의 조각들.
          </h1>

          <p>
            베뉴의 결과 두 사람의 선택, 그리고 그날의 이야기를 식탁 위에
            새깁니다.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="tabs gallery-filter">
            {CATS.map((c) => (
              <button
                key={c}
                className={`tab-btn${active === c ? " active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid-4">
            {visible.map((item) => (
              <div className="cell" key={item.image || item.name}>
                <PhotoSlot
                  src={
                    item.image
                      ? `${process.env.PUBLIC_URL}/images/gallery/${item.image}`
                      : undefined
                  }
                  alt={item.name}
                  caption={item.name}
                  ratio="4/3"
                  style={{
                    display: "block",

                    // 웨딩만 전체 사진 보이게
                    objectFit: item.cat === "WEDDING" ? "contain" : "cover",

                    // 모든 사진 중앙 기준
                    objectPosition: "center",

                    // 웨딩에서 남는 공간 아이보리
                    backgroundColor: "var(--ivory-deep)",
                  }}
                />

                <div style={{ padding: "16px 4px" }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--sage)",
                      marginBottom: 4,
                    }}
                  >
                    {item.cat}
                  </div>

                  <div
                    style={{
                      fontSize: 14.5,
                      color: "var(--brown)",
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Gallery;
