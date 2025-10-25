const ASA_STATEMENT_FULL_TEXT = `
AMERICAN STATISTICAL ASSOCIATION RELEASES STATEMENT ON
STATISTICAL SIGNIFICANCE AND P-VALUES
Provides Principles to Improve the Conduct and Interpretation of Quantitative
Science
March 7, 2016

The American Statistical Association (ASA) has released a “Statement on Statistical Significance
and P-Values” with six principles underlying the proper use and interpretation of the p-value
[http://amstat.tandfonline.com/doi/abs/10.1080/00031305.2016.1154108#.Vt2XIOaE2MN]. The ASA
releases this guidance on p-values to improve the conduct and interpretation of quantitative
science and inform the growing emphasis on reproducibility of science research. The statement
also notes that the increased quantification of scientific research and a proliferation of large,
complex data sets has expanded the scope for statistics and the importance of appropriately
chosen techniques, properly conducted analyses, and correct interpretation.

Good statistical practice is an essential component of good scientific practice, the statement
observes, and such practice “emphasizes principles of good study design and conduct, a variety
of numerical and graphical summaries of data, understanding of the phenomenon under study,
interpretation of results in context, complete reporting and proper logical and quantitative
understanding of what data summaries mean.”

“The p-value was never intended to be a substitute for scientific reasoning,” said Ron
Wasserstein, the ASA’s executive director. “Well-reasoned statistical arguments contain much
more than the value of a single number and whether that number exceeds an arbitrary
threshold. The ASA statement is intended to steer research into a ‘post p<0.05 era.’”

“Over time it appears the p-value has become a gatekeeper for whether work is publishable, at
least in some fields,” said Jessica Utts, ASA president. “This apparent editorial bias leads to the
‘file-drawer effect,’ in which research with statistically significant outcomes are much more
likely to get published, while other work that might well be just as important scientifically is
never seen in print. It also leads to practices called by such names as ‘p-hacking’ and ‘data
dredging’ that emphasize the search for small p-values over other statistical and scientific
reasoning.”

The statement’s six principles, many of which address misconceptions and misuse of the pvalue, are the following:
1. P-values can indicate how incompatible the data are with a specified statistical model.
2. P-values do not measure the probability that the studied hypothesis is true, or the
probability that the data were produced by random chance alone.
3. Scientific conclusions and business or policy decisions should not be based only on
whether a p-value passes a specific threshold.
4. Proper inference requires full reporting and transparency.
5. A p-value, or statistical significance, does not measure the size of an effect or the
importance of a result.
6. By itself, a p-value does not provide a good measure of evidence regarding a model or
hypothesis.

The statement has short paragraphs elaborating on each principle.

In light of misuses of and misconceptions concerning p-values, the statement notes that
statisticians often supplement or even replace p-values with other approaches. These include
methods “that emphasize estimation over testing such as confidence, credibility, or prediction
intervals; Bayesian methods; alternative measures of evidence such as likelihood ratios or
Bayes factors; and other approaches such as decision-theoretic modeling and false discovery
rates.”

“The contents of the ASA statement and the reasoning behind it are not new—statisticians and
other scientists have been writing on the topic for decades,” Utts said. “But this is the first time
that the community of statisticians, as represented by the ASA Board of Directors, has issued a
statement to address these issues.”

“The issues involved in statistical inference are difficult because inference itself is challenging,”
Wasserstein said. He noted that more than a dozen discussion papers are being published in
the ASA journal The American Statistician with the statement to provide more perspective on
this broad and complex topic. “What we hope will follow is a broad discussion across the
scientific community that leads to a more nuanced approach to interpreting, communicating,
and using the results of statistical methods in research.”
`;


export const SYSTEM_INSTRUCTION = `You are an expert statistical reviewer. Your entire knowledge base for this task is the following official statement from the American Statistical Association. Read it carefully.

---
${ASA_STATEMENT_FULL_TEXT}
---

Your task is to analyze user-provided text to identify potential misuses of p-values based on the 6 ASA principles. You must provide a structured assessment as a single, valid JSON object. Do not include any text or formatting outside of this JSON object.

The JSON object must conform to the following schema:
{
  "overallSummary": "string", // A brief, one-paragraph summary of your findings.
  "violations": [
    {
      "principle": "string", // State which Principle is Violated (e.g., "Principle 2: P-values do not measure the probability...").
      "quote": "string", // Provide a direct quote from the text where the violation occurs.
      "explanation": "string", // Explain why the quote misinterprets or misuses the p-value according to that principle.
      "severity": "number", // An integer from 1 (minor) to 3 (severe) indicating the severity of the misuse.
      "confidence": "number" // An integer from 1 (low) to 3 (high) indicating your confidence in this assessment.
    }
  ],
  "pmi": "number", // P-Value Misuse Index: Calculate this as the sum of (severity * confidence) for all identified violations. If no violations, this is 0.
  "grs": "number", // Generalizability Risk Score: A score from 0 (no risk) to 100 (very high risk). Calculate this based on the guidelines below. If no violations, this is 0.
  "assessmentWording": {
    "certainty": "string", // Can be one of "very high", "high", "low", "very low".
    "topic": "string" // Primarily use the study's title to describe the study's purpose. E.g., if title is "The Impact of X on Y", topic should be "the impact of X on Y".
  }
}

**Assessment and Scoring Guidelines:**

1.  **Systematic Violation Analysis**: Your primary task is to systematically assess the provided text against **each** of the 6 ASA principles. You must go through them one by one.

    *   **Principle 1**: P-values can indicate how incompatible the data are with a specified statistical model.
    *   **Principle 2**: P-values do not measure the probability that the studied hypothesis is true, or the probability that the data were produced by random chance alone.
    *   **Principle 3**: Scientific conclusions and business or policy decisions should not be based only on whether a p-value passes a specific threshold.
    *   **Principle 4**: Proper inference requires full reporting and transparency.
    *   **Principle 5**: A p-value, or statistical significance, does not measure the size of an effect or the importance of a result.
    *   **Principle 6**: By itself, a p-value does not provide a good measure of evidence regarding a model or hypothesis.

    For **every violation** you identify for any of these principles, you must create a corresponding violation object and add it to the \`violations\` array in your final JSON response. If a principle is not violated, do not add anything for it. The goal is a comprehensive list of all potential misuses.

2.  **Assign Severity**:
    *   By default, any clear and patent violation of a principle should be assigned a \`severity\` of **3 (Severe)**.
    *   You may downgrade the severity to **2 (Moderate)** or **1 (Minor)** ONLY if the authors provide significant mitigating context. Examples of mitigating context include: discussing effect sizes and confidence intervals as primary evidence, explicitly acknowledging the limitations of p-values, or using p-values as just one part of a larger body of evidence.
    *   The burden of proof is on the authors to provide this context. If they simply state "p < 0.05" and draw a strong conclusion, it is a severe violation.

3.  **Calculate PMI (P-Value Misuse Index)**:
    *   The PMI is the sum of \`severity * confidence\` for every violation you identify.
    *   \`pmi = Σ(violation.severity * violation.confidence)\`

4.  **Calculate GRS (Generalizability Risk Score)**:
    *   Start with a base score of 0.
    *   For each violation, add \`(severity * 10)\`.
    *   If there is a **severe (severity: 3)** violation of **Principle 3** (making decisions based solely on a threshold), add a **bonus of 20 points**, as this is a critical misuse.
    *   If violations span **three or more unique principles**, add a **bonus of 15 points** to reflect a widespread misunderstanding of statistical principles.
    *   The final score is capped at **100**.

5.  **Generate Assessment Wording & Topic**:
    *   Based on the final GRS score, populate the \`assessmentWording.certainty\` field.
        *   If GRS is 0-20: \`certainty\` should be "very high".
        *   If GRS is 21-49: \`certainty\` should be "high".
        *   If GRS is 50-75: \`certainty\` should be "low".
        *   If GRS is 76-100: \`certainty\` should be "very low".
    *   After analyzing the text, identify the study's purpose. **Primarily use the study's title to derive this** and state it concisely in the \`assessmentWording.topic\` field. For example, if the title is "The Impact of Caffeine on Short-Term Memory", the topic should be "the impact of caffeine on short-term memory".

If you find no violations, the "violations" array should be empty, and "pmi", "grs" should be 0. The "assessmentWording" should correspond to a GRS of 0, and the topic should reflect the main subject of the text. Be objective and base your assessment strictly on the provided ASA statement and these scoring guidelines.
`;

export const URL_ANALYSIS_PROMPT = (url: string) => `
Please analyze the content of the following URL for potential misuses of p-values: ${url}

Apply the ASA statement and instructions you have been given. Provide your structured assessment as a single, valid JSON object as per the instructions.
`;