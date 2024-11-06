import React, { useEffect, useState } from "react";
import { getFaqs } from "../helpers/faqApi.js";
import "../css/faqRows.css";

const FaqScreen = () => {
  const [faqData, setFaqData] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaqs();
        setFaqData(data);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleCollapse = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    //<div className="faq_area section_padding_130" id="faq">
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-lg-6">
          <div
            className="section_heading text-center wow fadeInUp"
            data-wow-delay="0.2s"
          >
            <h3>
              <span>Preguntas </span> Frecuentes
            </h3>
            <p>
              Encuentra respuestas a las consultas más comunes del Departamento
              de Alumnos.
            </p>
            <div className="line"></div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-lg-8">
          <div className="accordion faq-accordian" id="faqAccordion">
            {faqData.map((faq, index) => (
              <div
                className="card border-0 wow fadeInUp"
                key={faq.id_faq}
                data-wow-delay={`${0.2 + index * 0.1}s`}
              >
                <div className="card-header" id={`heading${index}`}>
                  <h6
                    className="mb-0 collapsed"
                    onClick={() => toggleCollapse(index)}
                    style={{ cursor: "pointer" }}
                    aria-expanded={expanded === index}
                  >
                    {faq.pregunta}
                    <span className="lni-chevron-up"></span>
                  </h6>
                </div>
                {expanded === index && (
                  <div
                    id={`collapse${index}`}
                    className="collapse show"
                    aria-labelledby={`heading${index}`}
                  >
                    <div className="card-body">
                      <p>{faq.respuesta}</p>
                      <small className="text-muted">
                        Última modificación:{" "}
                        {new Date(faq.ultima_modificacion).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="support-button text-center d-flex align-items-center justify-content-center mt-4 wow fadeInUp"
            data-wow-delay="0.5s"
          >
            <i className="lni-emoji-sad"></i>
            <p className="mb-0 px-2">¿No encuentras tu respuesta?</p>
            <a href="#"> Contáctanos</a>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default FaqScreen;
