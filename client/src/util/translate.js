import axios from "axios";

export const translate = async (text, targetLanguage) => {
	if (typeof text !== 'string' || !isNaN(text)) {
		return text;
	}

	const res = await axios.post("http://localhost:5000/translate", {
		q: text,
		source: "auto",
		target: targetLanguage,
		format: "text",
		api_key: ""
    });

	const translated = res.data.translatedText;

	if (targetLanguage === "en" && (translated === 'colour' || translated === 'Colour')) {
		return translated === 'colour' ? 'color' : 'Color';
	}
    return translated;
}

export default translate;