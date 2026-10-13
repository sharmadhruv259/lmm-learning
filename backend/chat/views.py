from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Conversation, Message, Profile
from .serializers import (
    ConversationDetailSerializer,
    ConversationSerializer,
    MessageSerializer,
    ProfileSerializer,
)
from .services import generate_reply


@api_view(["GET"])
def conversation_list(request):
    return Response(ConversationSerializer(Conversation.objects.all(), many=True).data)


@api_view(["GET", "PATCH", "DELETE"])
def conversation_detail(request, pk):
    try:
        conversation = Conversation.objects.get(pk=pk)
    except Conversation.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == "PATCH":  # rename
        title = request.data.get("title", "").strip()
        if title:
            conversation.title = title[:120]
            conversation.save()

    return Response(ConversationDetailSerializer(conversation).data)


@api_view(["POST"])
def chat(request):
    text = (request.data.get("message") or "").strip()
    if not text:
        return Response({"error": "Message is empty"}, status=status.HTTP_400_BAD_REQUEST)

    conversation_id = request.data.get("conversation_id")
    if conversation_id:
        try:
            conversation = Conversation.objects.get(pk=conversation_id)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        conversation = Conversation.objects.create(title=text[:40])

    user_msg = Message.objects.create(conversation=conversation, role="user", content=text)

    history = [
        {"role": m.role, "content": m.content} for m in conversation.messages.all()
    ]

    try:
        answer = generate_reply(history, Profile.load())
    except Exception as error:
        user_msg.delete()
        return Response({"error": str(error)}, status=status.HTTP_502_BAD_GATEWAY)

    reply = Message.objects.create(conversation=conversation, role="assistant", content=answer)
    conversation.save()  # bumps updated_at so it rises in the history list

    return Response(
        {
            "conversation": ConversationSerializer(conversation).data,
            "message": MessageSerializer(reply).data,
        }
    )


@api_view(["GET", "PUT"])
def profile(request):
    obj = Profile.load()
    if request.method == "PUT":
        serializer = ProfileSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(ProfileSerializer(obj).data)