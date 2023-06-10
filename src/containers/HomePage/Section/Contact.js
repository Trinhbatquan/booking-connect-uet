import React from "react";
import Slider from "react-slick";

const Contact = () => {
  return (
    <div className="section-container contact-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            Truyền thông nói gì về sản phẩm của chúng tôi
          </div>
        </div>
        <div className="section-body flex items-start justify-between">
          <div className="contact-video w-2/3">
            {/* <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/NvrjoUD6law"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe> */}
          </div>
          <div className="contact-logo w-1/3">
            <i className="text-headingColor mt-2">
              Kỹ thuật máy tính - ngành đào tạo đáp ứng nhu cầu của doanh nghiệp
              thời đại 4.0, được thiết kế và triển khai đào theo sáng kiến CDIO
              của MIT (Hoa Kỳ) và dựa trên các tiêu chuẩn quốc tế như ACM, IEEE,
              ABET… có tính liên thông cao với các chương trình đào tạo chất
              lượng cao khác như Công nghệ thông tin, Khoa học máy tính, Điện tử
              viễn thông.
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
