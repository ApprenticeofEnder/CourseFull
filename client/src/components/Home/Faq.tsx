import { Accordion, AccordionItem } from '@nextui-org/react';

import Section from '@/components/Home/Section';
import { useHomePage } from '@/lib/home/HomePageContext';

interface Question {
    question: string;
    answer: string;
}

export default function Faq() {
    const { refs } = useHomePage();

    const questions: Question[] = [
        {
            question: 'How much does CourseFull cost?',
            answer: "$5 per course. That's it! You get 3 courses for free, and you can keep the credits for as long as you have an account.",
        },
        {
            question: "What's the point of tracking my goals?",
            answer: 'So that you can stay on top of them throughout the entire semester. Beats panic checking what you need to get on the final last minute, right?',
        },
        {
            question: "Can't I just use a spreadsheet for this?",
            answer: "You can! If you have the skill, time, and energy to invest in maintaining a spreadsheet that can track your goals going forward, go for it. That said, some people don't have all three of those things, which is why CourseFull exists.",
        },
        {
            question: 'Do you use AI at all?',
            answer: "If by AI you mean generative AI like ChatGPT, not at the moment. If enough of our users want it, we're happy to implement AI functionality! However, we also want to be thoughtful of what we put in, making sure any generative AI or LLM feature is sensible. That means both in terms of what it can do and what it does with user data.",
        },
    ];

    return (
        <Section ref={refs?.faqRef.ref} title="FAQ">
            {/* Necessary because of flexbox stuff. */}
            <div className="w-full">
                <Accordion variant="splitted">
                    {questions.map(({ question, answer }, index) => {
                        return (
                            <AccordionItem
                                key={index}
                                aria-label={question}
                                title={question}
                                className="bg-primary-800"
                            >
                                {answer}
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </Section>
    );
}
