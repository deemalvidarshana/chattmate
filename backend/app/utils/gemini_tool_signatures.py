"""Preserve Gemini tool-call signatures with the pinned Agno adapter."""

from base64 import b64decode, b64encode

from agno.models.google import Gemini


class GeminiWithToolSignatures(Gemini):
    def parse_provider_response(self, response, **kwargs):
        parsed = super().parse_provider_response(response, **kwargs)
        return self._save_tool_signatures(response, parsed)

    def parse_provider_response_delta(self, response_delta):
        parsed = super().parse_provider_response_delta(response_delta)
        return self._save_tool_signatures(response_delta, parsed)

    @staticmethod
    def _save_tool_signatures(response, parsed):
        if not parsed.tool_calls or not response.candidates:
            return parsed

        content = response.candidates[0].content
        parts = (content.parts or []) if content else []
        function_parts = (part for part in parts if part.function_call is not None)
        for call, part in zip(parsed.tool_calls, function_parts):
            if part.thought_signature:
                # Agno persists tool calls as JSON between turns.
                call["gemini_thought_signature"] = b64encode(part.thought_signature).decode("ascii")
        return parsed

    def _format_messages(self, messages):
        formatted, system_message = super()._format_messages(messages)
        # Follow Agno's ordering of assistant function calls, including unsigned
        # siblings of a parallel call. Tool-result parts are excluded.
        calls = (
            call
            for message in messages
            if message.role not in {"system", "developer"}
            and (not message.content or self.reverse_role_map.get(message.role, message.role) == "model")
            for call in (message.tool_calls or [])
        )
        function_parts = (
            part
            for content in formatted
            for part in (getattr(content, "parts", None) or [])
            if part.function_call is not None
        )
        for call, part in zip(calls, function_parts):
            signature = call.get("gemini_thought_signature")
            if signature:
                part.thought_signature = b64decode(signature)
        return formatted, system_message
