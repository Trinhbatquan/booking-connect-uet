import React from "react";
import HomeHeader from "../HomeHeader";
import { useTranslation } from "react-i18next";
import HomeFooter from "./../HomeFooter";

const Inform = () => {
  const { i18n } = useTranslation();
  return (
    <div>
      <HomeHeader />
      <div className="w-full h-[100px]"></div>
      <div className="content-inform py-[20px] my-[5px] px-[10%] mx-auto">
        <h2 className="text-blurThemeColor font-semibold text-3xl pb-[19px] border-b-2 border-gray-300">
          {i18n.language === "en" ? "Inform" : "Giới thiệu"}
        </h2>
        <div className="detail-inform text-headingColor flex flex-col gap-1">
          <p className="font-semibold" style={{ fontSize: "16px" }}>
            Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội được thành lập
            theo Quyết định số 92/2004/QĐ-TTg ngày 25/05/2004 của Thủ tướng
            Chính phủ trên cơ sở Khoa Công nghệ và Trung tâm Hợp tác Đào tạo và
            Bồi dưỡng Cơ học trực thuộc Đại học Quốc gia Hà Nội với hai nhiệm vụ
            như sau:
          </p>
          <p className="" style={{ fontSize: "16px" }}>
            1. Đào tạo nguồn nhân lực trình độ đại học, sau đại học và bồi dưỡng
            nhân tài thuộc lĩnh vực khoa học, công nghệ;
          </p>
          <p className="" style={{ fontSize: "16px" }}>
            2. Nghiên cứu và triển khai ứng dụng khoa học, công nghệ đáp ứng nhu
            cầu phát triển kinh tế - xã hội.
          </p>
          <p className="" style={{ fontSize: "16px" }}>
            Sứ mạng của Nhà trường là đào tạo nguồn nhân lực chất lượng cao,
            trình độ cao và bồi dưỡng nhân tài; nghiên cứu phát triển và ứng
            dụng các lĩnh vực khoa học công nghệ tiên tiến mũi nhọn trên cơ sở
            phát huy thế mạnh về Công nghệ thông tin và Truyền thông. Nhà trường
            cũng đã xác định sứ mạng tiên phong tiếp cận chuẩn mực giáo dục đại
            học khu vực và thế giới, ứng dụng công nghệ thông tin trong quản trị
            đại học đóng góp tích cực vào sự phát triển nền kinh tế và xã hội
            tri thức của đất nước. Sứ mạng này hoàn toàn phù hợp và thống nhất
            với chủ trương, giải pháp và các mục tiêu của Chương trình đổi mới
            toàn diện giáo dục đại học mà Đảng và Nhà nước đang triển khai thực
            hiện.
          </p>
          <p className="text-center flex items-center justify-center">
            <img
              src="https://i-vn2.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/gioi-thieu-1.jpg"
              alt=""
              className="max-w-[50%] object-cover"
            />
          </p>
          <p style={{ fontSize: "16px" }}>
            Sau gần hai mươi năm xây dựng và phát triển, Trường Đại học Công
            nghệ đã và đang từng bước thực hiện nhiệm vụ và dần khẳng định là
            một trường đại học có vị thế, uy tín trong hệ thống giáo dục đại học
            của cả nước. Tỷ lệ giảng viên cơ hữu có trình độ tiến sĩ đạt 75%, tỷ
            lệ giáo sư và phó giáo sư đạt 25%, tỷ lệ công bố quốc tế tăng nhanh
            hằng năm. Môi trường đào tạo chuẩn mực chất lượng cao đã được thiết
            lập với hệ thống chương trình đào tạo được phát triển, hoàn thiện ở
            mọi bậc đào tạo theo hướng tiên tiến, hiện đại, cập nhật; chất lượng
            đào tạo được xã hội ghi nhận, đánh giá cao. Phần lớn các chương
            trình đào tạo của Trường Đại học Công nghệ được kiểm định chương
            trình đào tạo theo bộ tiêu chuẩn của mạng lưới các trường đại học
            ASEAN (AUN) và theo tiêu chuẩn của Bộ Giáo dục và Đào tạo. Trường
            Đại học Công nghệ còn là đối tác tin cậy của hơn 50 trường đại học,
            viện nghiên cứu và tập đoàn công nghiệp lớn trên thế giới. Nhà
            trường đi đầu và triển khai có hiệu quả hoạt động hợp tác "Trường -
            Viện - Doanh nghiệp".
          </p>
          <p className="text-center flex items-center justify-center">
            <img
              src="https://i-vn2.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/gioi-thieu-2.jpg"
              alt=""
              className="max-w-[50%] object-cover"
            />
          </p>
          <p className="text-center flex items-center justify-center">
            <img
              src="https://i-vn2.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/gioi-thieu-3.jpg"
              alt=""
              className="max-w-[50%] object-cover"
            />
          </p>
          <p className="text-center flex items-center justify-center">
            <img
              src="https://i-vn2.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/gioi-thieu-4.jpg"
              alt=""
              className="max-w-[50%] object-cover"
            />
          </p>
          <p style={{ fontSize: "16px" }}>
            Sinh viên Trường ĐHCN đạt thành tích cao trong các kỳ thi trong nước
            và quốc tế như kỳ thi lập trình sinh viên ACM/ICPC, PROCON, Imagine
            cup,...Sinh viên tốt nghiệp được xã hội đón nhận và đánh giá cao; tỷ
            lệ sinh viên ra trường có việc làm sau một năm cao. Cựu sinh viên
            của Nhà trường đã từng bước trưởng thành và đã có những đóng góp
            đáng kể cho phát triển khoa học công nghệ, kinh tế xã hội cho đất
            nước. Trường Đại học Công nghệ đã và đang là một địa chỉ đào tạo có
            uy tín, tin cậy, hấp dẫn, thu hút được những sinh viên có chất
            lượng.
          </p>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Inform;
