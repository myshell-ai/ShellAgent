
class ShellException(Exception):
    def __init__(self, error_code, error_head, msg, traceback=None, link=""):
        super().__init__('')
        self.error_code = error_code
        self.error_head = error_head
        self.msg = msg
        self.traceback = traceback
        self.trace_id = trace_id
        
    def format_dict(self):
        return {
            k: getattr(self, k) for k in ["error_code", "error_head", "msg", "traceback", "link"]
        }