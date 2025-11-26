// Updated according to latest VAPI Web SDK
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { toast } from 'sonner';
import { interviewer } from "@/constants";
// import type Message from "@vapi-ai/web";

const vapi = new Vapi(
    process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

interface TrialAgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const TrialAgent = ({ userName, type, userId, interviewId, questions }: TrialAgentProps) => {
    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(() => CallStatus.ACTIVE)
            console.log('Call Started');
            toast.success('Call Started Successfully.');
        };
        const onCallEnd = () => {
            setCallStatus(() => CallStatus.FINISHED);
            console.log('Call Ended');
            toast.success('Call Ended Successfully.');
        };

        // message handler - listens for final transcript events
        const onMessage = (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript };
                console.log(newMessage.content);
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        // console.log(messages);

        const onSpeechStart = () => {
            console.log('Assistant is Speaking');
            setIsSpeaking(() => true)
        };
        const onSpeechEnd = () => {
            console.log('Assistant stopped Speaking');
            setIsSpeaking(() => false)
        };
        const onError = (error: any) => {
            console.log("Vapi error:", error);
            setCallStatus(() => CallStatus.INACTIVE)
        }

        // Register listeners using the latest event names
        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on('message', onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off('message', onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Feedback Generate Here.');
        const { success, id } = {
            success: true,
            id: 'feedback-id'
        }

        if (success && id) {
            router.push(`/interview/${id}/feedback`);
        } else {
            console.log('Error Saving feedback');
            router.push('/');
        }
    }

    useEffect(() => {

        if (callStatus === CallStatus.FINISHED) {
            if (type === 'generate') {
                router.push("/");
            }
            else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId]);

    const handleCall = async () => {
        try {
            setCallStatus(() => CallStatus.CONNECTING);
            if (type === 'generate') {
                await vapi.start(
                    undefined,
                    undefined,
                    undefined,
                    process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },
                });
            } else {
                let formattedQuestions = '';
                if (questions) {
                    formattedQuestions = questions.map((ques) => `-${ques}`).join('\n');
                }
                await vapi.start(
                    interviewer, {
                    variableValues: {
                        questions: formattedQuestions
                    },
                });
            }

        } catch (error) {
            console.error("Failed to start VAPI workflow:", error);
            setCallStatus(() => CallStatus.INACTIVE);
        }
    };

    const handleDisconnect = async () => {
        // ask SDK to stop the current call/workflow
        try {
            await vapi.stop();
            console.log('Call Ended');
        } catch (e) {
            console.warn("vapi.stop() threw:", e);
            setCallStatus(() => CallStatus.FINISHED);
        }

    };

    const latestMesage = messages[messages.length - 1]?.content;

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/icon.svg"
                            height={65}
                            width={65}
                            alt="vapi ai"
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        {/* <div className="avatar"> */}
                        <Image
                            src="/user-avatar.png"
                            width={540}
                            height={540}
                            alt="user-avatar"
                            className="rounded-full object-cover size-[120px]"
                        />
                        {/* {!isSpeaking && <span className="animate-speak" />} */}
                        {/* </div> */}
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={latestMesage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {latestMesage}
                        </p>
                    </div>

                    {/* <div className="transcript">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                            >
                                <span>
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div> */}
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING ? (
                    // SHOW DISCONNECT/END CALL BUTTON
                    <button className="btn-disconnect cursor-pointer" onClick={handleDisconnect}>
                        {callStatus === CallStatus.CONNECTING ? "Connecting..." : callStatus === CallStatus.ACTIVE ? "..." : "End Call"}
                    </button>
                ) : (
                    <button className="relative btn-call" onClick={handleCall} disabled={callStatus === CallStatus.CONNECTING}>
                        <span
                            className={cn(
                                "absolute animate-ping rouneded-full opacity-75",
                                callStatus !== CallStatus.INACTIVE && "hidden" // Only ping when INACTIVE and ready
                            )}
                        />
                        <span>{callStatus === CallStatus.FINISHED ? "Start New Call" : "Start Call"}</span>
                    </button>
                )}
            </div>
        </>
    );
};

export default TrialAgent;
