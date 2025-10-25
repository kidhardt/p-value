import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, URL_ANALYSIS_PROMPT } from '../constants';
import { AssessmentResult } from "../types";

const MODEL_NAME = "gemini-2.5-pro";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generate(prompt: string, useGrounding: boolean = false): Promise<AssessmentResult> {
    try {
        const config: any = {
            responseMimeType: "application/json",
        };
        if (useGrounding) {
            config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                ...config
            },
        });

        const rawText = response.text;
        // Clean the response text to ensure it's valid JSON
        const cleanedText = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error calling Gemini API or parsing JSON:", error);
        throw new Error("Failed to communicate with the Gemini API or parse its response.");
    }
}

export const assessText = async (text: string): Promise<AssessmentResult> => {
    if (!text.trim()) {
        throw new Error("Input text cannot be empty.");
    }
    return generate(text);
};

export const assessUrl = async (url: string): Promise<AssessmentResult> => {
    if (!url.trim()) {
        throw new Error("URL cannot be empty.");
    }
    const prompt = URL_ANALYSIS_PROMPT(url);
    return generate(prompt, true);
};