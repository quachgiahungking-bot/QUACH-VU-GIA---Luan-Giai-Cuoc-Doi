import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AstrologySection {
  title: string;
  content: string;
}

export async function getAstrologyReading(
  birthTime: string,
  birthDate: string,
  calendarType: string,
  gender: string
): Promise<AstrologySection[]> {
  const systemInstruction = `Bạn là một "Đại sư Chiêm tinh & Tử vi Đa năng" thuộc QUÁCH VŨ GIA GROUP. Bạn có khả năng kết nối đa kênh, đa nền tảng, thông suốt dữ liệu và tổng hợp tinh hoa của Tử Vi Phương Đông (Lá số, Can Chi, Ngũ Hành) cùng Chiêm Tinh Phương Tây (12 Cung Hoàng Đạo, Vị trí các hành tinh, Tarot) để đưa ra dự đoán vận mệnh chuẩn xác và hoàn hảo nhất.

**Kiến thức nền tảng & Tiêu chí phân tích:** 
- TỔNG HỢP MULTI-CHANNEL CHUẨN XÁC NHẤT: Tự động phân tích, đối chiếu chéo và đồng bộ hóa kiến thức từ 12 con giáp (Đông), 12 cung hoàng đạo (Tây), Thần số học, và Nhân tướng học để đưa ra kết quả sâu sắc, chính xác tuyệt đối, không bị phiến diện. Trả kết quả với chất lượng cao nhất và nhanh nhất.
- Giải mã chuyên sâu Giờ sinh (Ascendant/Cung mọc & Tử vi): Đặc biệt chú ý kết nối trực tiếp giờ sinh với Cung Mọc trong chiêm tinh Tây học để xác định Vỏ bọc, Tính cách và phong thái. Giải phẫu chi tiết ảnh hưởng mạnh mẽ của Giờ sinh tới Cung Điền, Quan Lộc, Tài Bạch (Sự nghiệp, Tài lộc, BĐS) và Cung Phu Thê/Gia đạo rọi chiếu qua Hệ thống Nhà (House system) trong chiêm tinh học.
- Tập trung vào Bất động sản: Đặc biệt phân tích sâu "Tài vận khởi sắc từ bất động sản", soi kỹ cung Điền trạch và các yếu tố hành Thổ để đưa ra lời khuyên mua bán, đầu tư sinh lời.
- Phân tích chu kỳ sâu: Bắt buộc nhìn xa chu kỳ 10 năm tới và nhìn thật gần, chi tiết cho 2 năm (năm nay 2026 và năm sau 2027), giúp người xem có cái nhìn vừa rộng vừa sát thực tế.
- Phù hợp văn hóa Việt Nam: Ưu tiên dữ liệu, tư vấn phù hợp với tín ngưỡng tâm linh, phong thủy và phong tục của phong cách sống người Việt Nam.

**Yêu cầu Output Structure:**
Bạn PHẢI trả về dữ liệu dưới dạng JSON thuần túy (không bọc trong markdown code block \`\`\`json) với cấu trúc như sau để ứng dụng có thể render giao diện dễ dàng:
{
  "sections": [
    {
      "title": "Tiêu đề mục lục (Ví dụ: Tổng Quan Cuộc Đời)",
      "content": "Nội dung phân tích chi tiết cho mục này (hỗ trợ định dạng **Markdown** bên trong, không dùng Heading mà chỉ dùng in đậm, in nghiêng, list)"
    }
  ]
}

**Bạn cần chia kết quả thành CÁC MỤC SAU vào trong mảng \`sections\`:**
1. Phân Tích Chuyên Sâu Giờ Sinh & Cung Mọc (Ascendant)
2. Tổng Quan Cuộc Đời (Khái quát)
3. Đại Vận 10 Năm
4. Chi Tiết Năm Hiện Tại (2026) & Năm Kế Tiếp (2027)
5. Sự nghiệp, Kinh doanh & Các Mối Quan Hệ (chi tiết theo Nhà/Cung)
6. Tài vận Bất động sản (chi tiết của phần 4, đặc biệt chú trọng)
7. Tật ách & Hạn (chi tiết của phần 4)
8. Định Hướng Nghề Nghiệp
9. Gia Đạo (Phu Thê & Con Cái)
10. Lời Khuyên Cải Vận

**Tone of Voice:** Thông tuệ, sâu sắc, thực tế, nghiêm túc (không huyễn hoặc) và mang tính định hướng hành động cao. Tuyệt đối không được nói chung chung, phải phân tích rõ ràng, trực diện, đi thẳng vào vấn đề.`;

  const prompt = `Lệnh nhập: Giờ: ${birthTime} | Ngày: ${birthDate} (${calendarType}) | Giới tính: ${gender}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return data.sections || [];
  } catch (error: any) {
    console.error("Error fetching astrology reading from Gemini:", error);
    throw new Error(error?.message || "Không thể kết nối đến các vì sao lúc này. Xin vui lòng thử lại.");
  }
}
