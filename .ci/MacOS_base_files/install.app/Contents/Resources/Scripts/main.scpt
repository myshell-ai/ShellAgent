FasdUAS 1.101.10   ��   ��    k             l     ��  ��    . ( Determine the path of the script itself     � 	 	 P   D e t e r m i n e   t h e   p a t h   o f   t h e   s c r i p t   i t s e l f   
  
 l    	 ����  r     	    I    ��  
�� .earsffdralis        afdr   f       �� ��
�� 
rtyp  m    ��
�� 
TEXT��    o      ���� 0 thisfilepath thisFilePath��  ��        l     ��  ��    8 2 Convert to POSIX path (standard file system path)     �   d   C o n v e r t   t o   P O S I X   p a t h   ( s t a n d a r d   f i l e   s y s t e m   p a t h )      l  
  ����  r   
     n   
     1    ��
�� 
psxp  l  
  ����  b   
      l  
  !���� ! o   
 ���� 0 thisfilepath thisFilePath��  ��     m     " " � # #  : :��  ��    o      ����  0 thisfolderpath thisFolderPath��  ��     $ % $ l     ��������  ��  ��   %  & ' & l     �� ( )��   (   Check CPU architecture    ) � * * .   C h e c k   C P U   a r c h i t e c t u r e '  + , + l    -���� - r     . / . I   �� 0��
�� .sysoexecTEXT���     TEXT 0 m     1 1 � 2 2  u n a m e   - m��   / o      ���� 0 cpuinfo cpuInfo��  ��   ,  3 4 3 l    5���� 5 r     6 7 6 m     8 8 � 9 9   7 o      ����  0 condainstaller condaInstaller��  ��   4  : ; : l     ��������  ��  ��   ;  < = < l   P >���� > Z    P ? @ A B ? =   ! C D C o    ���� 0 cpuinfo cpuInfo D m      E E � F F 
 a r m 6 4 @ r   $ ' G H G m   $ % I I � J J � h t t p s : / / r e p o . a n a c o n d a . c o m / m i n i c o n d a / M i n i c o n d a 3 - l a t e s t - M a c O S X - a r m 6 4 . s h H o      ����  0 condainstaller condaInstaller A  K L K =  * - M N M o   * +���� 0 cpuinfo cpuInfo N m   + , O O � P P  x 8 6 _ 6 4 L  Q�� Q r   0 3 R S R m   0 1 T T � U U � h t t p s : / / r e p o . a n a c o n d a . c o m / m i n i c o n d a / M i n i c o n d a 3 - l a t e s t - M a c O S X - x 8 6 _ 6 4 . s h S o      ����  0 condainstaller condaInstaller��   B k   6 P V V  W X W I  6 M�� Y Z
�� .sysodlogaskr        TEXT Y m   6 9 [ [ � \ \ $ U n d e f i n e d   c p u   a r c h Z �� ] ^
�� 
btns ] J   < A _ _  `�� ` m   < ? a a � b b  O k��   ^ �� c��
�� 
dflt c m   D G d d � e e  O k��   X  f�� f L   N P����  ��  ��  ��   =  g h g l     ��������  ��  ��   h  i j i l     ��������  ��  ��   j  k l k l     �� m n��   m ( " Prepare the shell script commands    n � o o D   P r e p a r e   t h e   s h e l l   s c r i p t   c o m m a n d s l  p q p l  Q d r���� r r   Q d s t s b   Q ` u v u b   Q \ w x w b   Q Z y z y b   Q V { | { m   Q T } } � ~ ~ 
 
 c d   ' | o   T U����  0 thisfolderpath thisFolderPath z m   V Y   � � �< ' 
 
 i n s t a l l _ m i n i c o n d a ( )   { 
 
         e x p o r t   P A T H = " / u s r / b i n : $ P A T H " 
 
         e c h o   " = = = = = = = = = >       C h e c k   i f   M i n i c o n d a   i s   i n s t a l l e d " 
         i f   [   !   - d   " . / m i n i c o n d a "   ] ;   t h e n 
                 e c h o   " = = = = = = = = = >       M i n i c o n d a   n o t   f o u n d .   I n s t a l l i n g   M i n i c o n d a . . . " 
                 
                 i f   [   !   - f   M i n i c o n d a 3 - l a t e s t - M a c O S X . s h   ] ;   t h e n 
                         e c h o   " = = = = = = = = = >       M i n i c o n d a   i n s t a l l e r   n o t   f o u n d .   D o w n l o a d i n g . . . " 
                         c u r l   - o   M i n i c o n d a 3 - l a t e s t - M a c O S X . s h   x o   Z [����  0 condainstaller condaInstaller v m   \ _ � � � � �� 
                 e l s e 
                         e c h o   " = = = = = = = = = >       M i n i c o n d a   i n s t a l l e r   a l r e a d y   e x i s t s .   S k i p p i n g   d o w n l o a d . " 
                 f i 
                 
                 s h   M i n i c o n d a 3 - l a t e s t - M a c O S X . s h   - b   - p   . / m i n i c o n d a 
                 e c h o   " = = = = = = = = = >       M i n i c o n d a   i n s t a l l e d . " 
         f i 
         
         e c h o   " = = = = = = = = = >       I n i t i a l i z e   M i n i c o n d a " 
         s o u r c e   " . / m i n i c o n d a / e t c / p r o f i l e . d / c o n d a . s h " 
         c o n d a   i n i t 
         c o n t i n u e _ s c r i p t 
 } 
 
 c o n t i n u e _ s c r i p t ( )   { 
         e c h o   " = = = = = = = = = >       C r e a t e   a n d   a c t i v a t e   C o n d a   e n v i r o n m e n t " 
         c o n d a   c r e a t e   - n   s h e l l a g e n t   p y t h o n = 3 . 1 0   - y 
         c o n d a   a c t i v a t e   s h e l l a g e n t 
         w h i c h   p y t h o n 
 
         e c h o   " = = = = = = = = = >       C h a n g e   d i r e c t o r y   t o   t h e   c l o n e d   r e p o s i t o r y " 
         c d   S h e l l A g e n t 
         e c h o   " = = = = = = = = = >       I n s t a l l   d e p e n d e n c i e s   u s i n g   P o e t r y " 
         p i p   i n s t a l l   p o e t r y 
         p i p   i n s t a l l   - e   . 
 
 } 
 
 
 e c h o   " = = = = = = = = = = = = = = = = = = = = = = = = = = = >   I n s t a l l S h e l l A g e n t     v . 1 . 0 . 0     < = = = = = = = = = = = = = = = = = = = = = = = = = = = " 
 i n s t a l l _ m i n i c o n d a 
 t o      ���� 0 shellscript shellScript��  ��   q  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � + % Execute the shell script in Terminal    � � � � J   E x e c u t e   t h e   s h e l l   s c r i p t   i n   T e r m i n a l �  � � � l  e y ����� � O   e y � � � k   k x � �  � � � I  k p������
�� .miscactvnull��� ��� null��  ��   �  ��� � I  q x�� ���
�� .coredoscnull��� ��� ctxt � o   q t���� 0 shellscript shellScript��  ��   � m   e h � ��                                                                                      @ alis    8  �˵���                     � ;yBD ����Terminal.app                                                   ����� ;y        ����  
 cu             	Utilities   -/:System:Applications:Utilities:Terminal.app/     T e r m i n a l . a p p   kdu5�  *System/Applications/Utilities/Terminal.app  / ��  ��  ��   �  ��� � l     ��������  ��  ��  ��       �� � ���   � ��
�� .aevtoappnull  �   � **** � �� ����� � ���
�� .aevtoappnull  �   � **** � k     y � �  
 � �   � �  + � �  3 � �  < � �  p � �  �����  ��  ��   �   � �������� "���� 1���� 8�� E I O T [�� a�� d���� }  ��� �����
�� 
rtyp
�� 
TEXT
�� .earsffdralis        afdr�� 0 thisfilepath thisFilePath
�� 
psxp��  0 thisfolderpath thisFolderPath
�� .sysoexecTEXT���     TEXT�� 0 cpuinfo cpuInfo��  0 condainstaller condaInstaller
�� 
btns
�� 
dflt�� 
�� .sysodlogaskr        TEXT�� 0 shellscript shellScript
�� .miscactvnull��� ��� null
�� .coredoscnull��� ��� ctxt�� z)��l E�O��%�,E�O�j E�O�E�O��  �E�Y (��  �E�Y a a a kva a a  OhOa �%a %�%a %E` Oa  *j O_ j Uascr  ��ޭ