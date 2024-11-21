
class ShellException(Exception):
    def __init__(self, error_code, error_head, msg, traceback=None):
        super().__init__('')
        self.error_code = error_code
        self.error_head = error_head
        self.msg = msg
        self.traceback = traceback
        
    def format_dict(self):
        return {
            k: getattr(self, k) for k in ["error_code", "error_head", "msg", "traceback"]
        }