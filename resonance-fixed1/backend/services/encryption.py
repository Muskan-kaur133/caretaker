import base64
import hashlib


def encrypt_content(content: str, uid: str) -> str:
    """
    Simple deterministic obfuscation for demo purposes.
    In production, use a proper encryption library with a secure key.
    """
    key = hashlib.sha256(uid.encode()).digest()
    encoded = base64.b64encode(content.encode()).decode()
    return encoded


def decrypt_content(encrypted: str, uid: str) -> str:
    try:
        return base64.b64decode(encrypted.encode()).decode()
    except Exception:
        return ""
